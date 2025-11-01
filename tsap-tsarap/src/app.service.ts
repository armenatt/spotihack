/* eslint-disable @typescript-eslint/no-misused-promises */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import getMinutes from './utils/getMinutes';
import * as Ffmpeg from 'fluent-ffmpeg';
import { InjectS3, S3 } from 'nestjs-s3';
import { createReadStream, createWriteStream } from 'node:fs';
import { readdir, rm } from 'node:fs/promises';
import promisifyCommand from './utils/promisifyCommand';
import { ETrackStatuses } from './trackStatuses';
import { ClientKafka } from '@nestjs/microservices';
import { YtDlp } from 'ytdlp-nodejs';
import { getBasicInfo } from '@distube/ytdl-core';

@Injectable()
export class AppService implements OnModuleInit {
  private ytdlp = new YtDlp({
    binaryPath: '/usr/local/yt-dlp/yt-dlp',
    ffmpegPath: '/usr/bin/ffmpeg',
  });
  constructor(
    @InjectS3() private readonly s3: S3,
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaService.connect();
  }

  async getVideoInfo(link: string) {
    const id = new URLSearchParams(new URL(link).searchParams).get('v');
    const info = await getBasicInfo(id!);

    if (Number(info.videoDetails.lengthSeconds) / 60 > 10) {
      throw new Error('Video duration exceeds 10 minutes');
    }

    return {
      title: info.videoDetails.title,
      duration: parseInt(info.videoDetails.lengthSeconds),
    };
  }

  async downloadAudio(link: string, id: string) {
    const writeStream = createWriteStream(
      process.cwd() + '/targetFolder/temp/' + id + '.mp3',
    );
    const videoId = new URLSearchParams(new URL(link).searchParams).get('v');

    const result = this.ytdlp.stream(videoId!, {
      format: { filter: 'audioonly', quality: 10 },
    });

    await result.pipeAsync(writeStream);
  }

  async convertAudioToHls(input: string, id: string, targetPath: string) {
    const command = Ffmpeg(input);
    command
      .addOutputOption('-f segment')
      .addOutputOption('-segment_format mpegts')
      .addOutputOption('-segment_time 2')
      .addOutputOption(`-segment_list output.m3u8`)
      .addOutputOption('-hls_playlist_type vod')
      .addOutputOption(
        `-hls_segment_filename ${targetPath}/${id}_segment%03d.ts`,
      )
      .format('hls')
      .output(targetPath + id + '.m3u8');
    await promisifyCommand(command);
  }

  async uploadToBucket(id: string) {
    const dir = process.cwd() + '/targetFolder/' + id;
    try {
      const files = await readdir(dir, { withFileTypes: true });
      files.forEach(async (file) => {
        const filepath = dir + '/' + file.name;
        await this.s3.putObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Body: createReadStream(filepath),
          Key: id + '/' + file.name,
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateTrackStatus(
    id: string,
    payload: { status: ETrackStatuses; name?: string; duration?: number },
  ) {
    await this.kafkaService.producer.send({
      topic: 'tsap-tsarap.upload.update-status',
      messages: [
        {
          key: id,
          value: JSON.stringify({ id, ...payload }),
        },
      ],
    });
  }

  async deleteFromTargetFolder(id: string) {
    const dir = process.cwd() + '/targetFolder/' + id;
    await rm(dir, { recursive: true, force: true });
  }
}
