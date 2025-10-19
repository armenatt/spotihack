/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectS3, S3 } from 'nestjs-s3';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { ClientKafka } from '@nestjs/microservices';
import { UserService } from 'src/user/user.service';
import { validateURL } from '@distube/ytdl-core';
import { Playlist } from './entities/playlist.entity';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { ETrackStatuses } from './entities/trackStatuses';
import { PlaylistTrack } from './entities/playlist-track.entity';

@Injectable()
export class TrackPlaylistService implements OnModuleInit {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(PlaylistTrack)
    private readonly playlistTrackRepository: Repository<Playlist>,
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    @Inject() private readonly userService: UserService,
    @InjectS3() private readonly s3: S3,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async uploadTrack(link: string, user: { id: string; email: string }) {
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

    if (alreadyExists) {
      return alreadyExists;
    }

    const foundUser = await this.userService.findOneById(user.id);

    const newTrack = this.trackRepository.create({
      status: ETrackStatuses.Started,
      videoId,
    });

    const savedTrack = await this.trackRepository.save(newTrack);

    await this.addTrackToPlaylist(foundUser?.favouriteTracks!, savedTrack);

    const newTrackInfo = {
      link,
      id: savedTrack.id,
    };

    await this.client.producer.send({
      topic: 'tsap-tsarap.upload',
      messages: [{ key: 'track', value: JSON.stringify(newTrackInfo) }],
    });

    return {
      id: savedTrack.id,
    };
  }

  async updateTrack(
    id: string,
    status: ETrackStatuses,
    name?: string,
    duration?: number,
  ) {
    return this.trackRepository.update({ id }, { status, name, duration });
  }

  async downloadTrackM3U8ById(id: string) {
    const res = await this.s3.getObject({
      Bucket: 'tsap-tsarap-bucket',
      Key: `${id}/${id}.m3u8`,
    });

    const m3u8String = await res.Body?.transformToString('utf-8')!;
    const pattern = id + '_segment\\d{3}\\.ts';

    const segments = Array.from(m3u8String.matchAll(new RegExp(pattern, 'g')));
    let newM3U8String = m3u8String;
    for (const segment of segments) {
      const command = new GetObjectCommand({
        Bucket: 'tsap-tsarap-bucket',
        Key: `${id}/${segment[0]}`,
      });
      const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
      newM3U8String = newM3U8String.replace(segment[0], url);
    }
    return newM3U8String;
  }

  async createPlaylist(name: string, email?: string) {
    const newPlaylist = this.playlistRepository.create({ name });
    if (email) {
      const user = await this.userService.findOneByEmail(email);
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
    const playlistTrack = new PlaylistTrack();

    playlistTrack.track = track;
    playlistTrack.playlist = playlist;

    playlist.playlistTrack.push(playlistTrack);
    await this.playlistTrackRepository.save(playlistTrack);
    return this.playlistRepository.save(playlist);
  }

  async getFavouriteTracks(userId: string) {
    const playlist = await this.playlistRepository
      .createQueryBuilder('playlist')
      .where('playlist.userId= :userId', { userId })
      .leftJoinAndSelect('playlist.playlistTrack', 'playlistTrack')
      .leftJoinAndSelect('playlistTrack.track', 'track')
      .loadRelationCountAndMap('playlist.trackCount', 'playlist.playlistTrack')
      .orderBy('playlistTrack.createdAt', 'DESC')
      .getOne();

    const { durationSum } = await this.playlistRepository
      .createQueryBuilder('playlist')
      .where(`playlist.userId= :userId`, { userId })
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
