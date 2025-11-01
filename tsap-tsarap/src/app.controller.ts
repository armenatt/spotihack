import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { existsSync, mkdirSync } from 'fs';
import { UploadTrackDto } from './dtos/upload-track-dto';
import { ETrackStatuses } from './trackStatuses';
import { rm } from 'fs/promises';
import { validateURL } from '@distube/ytdl-core';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('tsap-tsarap.upload')
  async uploadTrack(@Payload() message: UploadTrackDto) {
    const isValid = validateURL(message.link);
    if (!isValid) {
      console.log('error', 'Link not valid');
      return;
    }
    console.log('info', 'Link valid');

    await this.appService.updateTrackStatus(message.id, {
      status: ETrackStatuses.Downloading,
    });
    console.log('info', 'Getting Info');

    const result = await this.appService.getVideoInfo(message.link);

    if (!result) {
      return 'Not found';
    }
    console.log('info', 'Downloading');

    await this.appService.downloadAudio(message.link, message.id);

    console.log('info', 'Finished downloading');

    const targetDir = `${process.cwd()}/targetFolder/${message.id}/`;
    await this.appService.updateTrackStatus(message.id, {
      status: ETrackStatuses.Downloading,
      name: result.title,
      duration: result.duration,
    });
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir);
    }
    console.log('info', 'Converting');
    await this.appService.updateTrackStatus(message.id, {
      status: ETrackStatuses.Processing,
    });
    const audioPath =
      process.cwd() + '/targetFolder/temp/' + message.id + '.mp3';
    await this.appService.convertAudioToHls(audioPath, message.id, targetDir);
    await rm(audioPath, { force: true });
    console.log('info', 'Finished converting');

    console.log('info', 'Uploading');
    await this.appService.updateTrackStatus(message.id, {
      status: ETrackStatuses.Uploading,
    });
    await this.appService.uploadToBucket(message.id);
    console.log('info', 'Finished uploading');
    await this.appService.deleteFromTargetFolder(message.id);
    console.log('info', 'Finished');
    await this.appService.updateTrackStatus(message.id, {
      status: ETrackStatuses.Ready,
    });
  }
}
