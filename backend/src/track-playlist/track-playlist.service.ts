/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { ClientKafka } from '@nestjs/microservices';
import { UserService } from 'src/user/user.service';
import { validateURL } from '@distube/ytdl-core';
import { Playlist } from './entities/playlist.entity';
import { ETrackStatuses } from './entities/trackStatuses';
import { PlaylistTrack } from './entities/playlist-track.entity';
import { WsUsersService } from 'src/ws-users/ws-users.service';

@Injectable()
export class TrackPlaylistService implements OnModuleInit {
  public trackToUserMap: Map<string, string>;

  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(PlaylistTrack)
    private readonly playlistTrackRepository: Repository<PlaylistTrack>,
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    @Inject() private readonly userService: UserService,
    @Inject() private readonly wsUserService: WsUsersService,
  ) {
    this.trackToUserMap = new Map<string, string>();
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async uploadTrack(
    link: string,
    playlistId: string,
    user: { id: string; email: string },
  ) {
    const isValidYTLink = validateURL(link);
    if (!isValidYTLink) {
      return {
        error: 'Link is invalid',
      };
    }

    const urlParams = new URLSearchParams(new URL(link).searchParams);
    const videoId = urlParams.get('v')!;

    const alreadyExists = await this.trackRepository.findOne({
      where: { videoId },
    });

    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: {
        user: true,
        playlistTrack: true,
      },
    });

    if (!playlist) {
      return { error: "Playlist doesn't exist" };
    }

    if (playlist.user.id !== user.id) {
      return "You're not the owner of the given playlist";
    }

    if (alreadyExists) {
      const playlistTrack = await this.playlistTrackRepository
        .createQueryBuilder('playlistTrack')
        .where('playlistTrack.trackId= :trackId', {
          trackId: alreadyExists.id,
        })
        .andWhere('playlistTrack.playlistId= :playlistId', {
          playlistId,
        })
        .getOne();

      if (playlistTrack) {
        return { error: 'The track is already added to that playlist' };
      } else {
        return this.addTrackToPlaylist(playlist, alreadyExists);
      }
    }

    const newTrack = this.trackRepository.create({
      status: ETrackStatuses.Started,
      videoId,
    });

    const savedTrack = await this.trackRepository.save(newTrack);

    await this.addTrackToPlaylist(playlist, savedTrack);

    const newTrackInfo = {
      link,
      id: savedTrack.id,
    };

    await this.client.producer.send({
      topic: 'tsap-tsarap.upload',
      messages: [{ key: 'track', value: JSON.stringify(newTrackInfo) }],
    });

    this.addTrackToUserMap(user.id, newTrack.id);

    return {
      id: savedTrack.id,
    };
  }

  addTrackToUserMap(userId: string, trackId: string) {
    this.trackToUserMap.set(trackId, userId);
  }

  async updateTrack(
    id: string,
    status: ETrackStatuses,
    name?: string,
    duration?: number,
  ) {
    // TODO: refactor this
    const userId = this.trackToUserMap.get(id);
    if (userId) {
      this.wsUserService.userToSocketMap.get(userId)?.send(
        JSON.stringify({
          eventName: 'updateTrack',
          name,
          duration,
          trackId: id,
          status,
        }),
      );
    }
    return this.trackRepository.update({ id }, { status, name, duration });
  }

  async createPlaylist({
    name,
    id,
    favourite,
  }: {
    name?: string;
    id?: string;
    favourite?: boolean;
  }) {
    const newPlaylist = this.playlistRepository.create({ name, favourite });
    if (id) {
      const user = await this.userService.findOneById(id);
      newPlaylist.user = user!;
    }
    return this.playlistRepository.save(newPlaylist);
  }

  async getPlaylistById(playlistId: string, userId?: string) {
    let user;

    if (userId) {
      user = await this.userService.findOneById(userId);
    }
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId, user },
      relations: {
        playlistTrack: {
          track: true,
        },
      },
    });

    return playlist;
  }

  updatePlaylist(playlist: Playlist) {
    return this.playlistRepository.save(playlist);
  }

  async getTrackById(trackId: string) {
    return this.trackRepository.findOneBy({ id: trackId });
  }

  async addTrackToPlaylist(playlist: Playlist, track: Track) {
    const playlistTrack = this.playlistTrackRepository.create({
      track,
      playlist,
    });
    playlist.playlistTrack.push(playlistTrack);
    await this.playlistTrackRepository.save(playlistTrack);
    return this.playlistRepository.save(playlist);
  }

  async getPlaylistList(userId: string) {
    const playlists = await this.playlistRepository
      .createQueryBuilder('playlist')
      .where('playlist.userId= :userId', { userId })
      .loadRelationCountAndMap('playlist.trackCount', 'playlist.playlistTrack')
      .getMany();

    return playlists;
  }

  async getPlaylistWithTracksById(playlistId: string) {
    const playlist = await this.playlistRepository
      .createQueryBuilder('playlist')
      .where('playlist.id= :id', { id: playlistId })
      .leftJoinAndSelect('playlist.playlistTrack', 'playlistTrack')
      .leftJoinAndSelect('playlistTrack.track', 'track')
      .loadRelationCountAndMap('playlist.trackCount', 'playlist.playlistTrack')
      .orderBy('playlistTrack.createdAt', 'DESC')
      .getOne();

    const { durationSum } = await this.playlistRepository
      .createQueryBuilder('playlist')
      .where(`playlist.id= :id`, { id: playlistId })
      .leftJoin('playlist.playlistTrack', 'playlistTrack')
      .leftJoin('playlistTrack.track', 'track')
      .select('SUM(track.duration)', 'durationSum')
      .getRawOne();

    const mappedResult = {
      ...playlist,
      tracks: playlist?.playlistTrack.map((playlistTrack) => ({
        ...playlistTrack.track,
        id: playlistTrack.track.id,
        playlistTrackId: playlistTrack.id,
        trackCreatedAt: playlistTrack.track.createdAt,
        createdAt: playlistTrack.createdAt,
      })),
      durationSum,
    };
    delete mappedResult.playlistTrack;
    return mappedResult;
  }
}
