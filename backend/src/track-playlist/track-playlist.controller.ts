import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TrackPlaylistService } from './track-playlist.service';
import { UploadTrackDto } from './dtos/upload-track-dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TrackUpadteDto } from './dtos/track-update-dto';

@Controller('')
export class TrackPlaylistController {
  constructor(
    @Inject() private readonly trackPlaylistService: TrackPlaylistService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('user/favourite-tracks')
  getUserFavouriteTracks(@Req() req: { user: { id: string } }) {
    return this.trackPlaylistService.getFavouriteTracks(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('track/upload')
  uploadTrack(
    @Req() req: { user: { id: string; email: string } },
    @Body() payload: UploadTrackDto,
  ) {
    return this.trackPlaylistService.uploadTrack(payload.link, req.user);
  }
  @UseGuards(AuthGuard)
  @Get('track/:id')
  getTrackById(@Param() params: { id: string }) {
    return this.trackPlaylistService.downloadTrackM3U8ById(params.id);
  }

  @UseGuards(AuthGuard)
  @Post('/playlist/create')
  createPlaylist(
    @Req() req: { user: { email: string } },
    @Body() body: { name: string },
  ) {
    return this.trackPlaylistService.createPlaylist(body.name, req.user.email);
  }

  @UseGuards(AuthGuard)
  @Get('playlist/:id')
  getPlaylist(@Param('id') id: string) {
    return this.trackPlaylistService.getPlaylistById(id);
  }

  @UseGuards(AuthGuard)
  @Post('playlist/:id/add')
  async addTrackToPlaylist(
    @Req() req: { user: { id: string } },
    @Param('id') playlistId: string,
    @Body() body: { trackId: string },
  ) {
    const playlist = await this.trackPlaylistService.getPlaylistById(
      playlistId,
      req.user.id,
    );

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const track = await this.trackPlaylistService.getTrackById(body.trackId);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    playlist?.tracks.push(track);

    return this.trackPlaylistService.updatePlaylist(playlist);
  }

  // KAFKA
  @MessagePattern('tsap-tsarap.upload.update-status')
  async trackUpdate(@Payload() message: TrackUpadteDto) {
    await this.trackPlaylistService.updateTrack(
      message.id,
      message.status,
      message.name,
      message.duration,
    );
  }
}
