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
  @Post('track/upload')
  uploadTrack(
    @Req() req: { user: { id: string; email: string } },
    @Body() payload: UploadTrackDto,
  ) {
    return this.trackPlaylistService.uploadTrack(
      payload.link,
      payload.playlistId,
      req.user,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/playlist/create')
  createPlaylist(
    @Req() req: { user: { id: string } },
    @Body() body: { name: string },
  ) {
    return this.trackPlaylistService.createPlaylist({
      name: body.name,
      id: req.user.id,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/playlists')
  getPlaylists(@Req() req: { user: { id: string } }) {
    return this.trackPlaylistService.getPlaylistList(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('playlist/:id')
  getPlaylist(@Param('id') id: string) {
    return this.trackPlaylistService.getPlaylistWithTracksById(id);
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

    // playlist?.playlistTrack.push(track);

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
