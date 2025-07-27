import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { validateURL } from '@distube/ytdl-core';
import { mkdirSync } from 'fs';
import { UploadTrackDto } from './dtos/upload-track-dto';
import { ETrackStatuses } from './trackStatuses';

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
    console.log('info', 'Downloading');
    const result = await this.appService.getVideoReadableStream(message.link);
    if (!result) {
      return;
    }
    console.log('info', 'Finished downloading');

    const targetDir = `${process.cwd()}/targetFolder/${message.id}/`;
    await this.appService.updateTrackStatus(message.id, {
      status: ETrackStatuses.Downloading,
      name: result.info.title,
      duration: result.info.lengthSeconds,
    });
    mkdirSync(targetDir);
    console.log('info', 'Converting');
    await this.appService.updateTrackStatus(message.id, {
      status: ETrackStatuses.Processing,
    });
    await this.appService.convertAudioToHls(
      result.audio,
      message.id,
      targetDir,
    );
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
