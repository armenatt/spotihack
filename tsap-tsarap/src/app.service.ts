/* eslint-disable @typescript-eslint/no-misused-promises */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Innertube } from 'youtubei.js';
import getMinutes from './utils/getMinutes';
import * as Ffmpeg from 'fluent-ffmpeg';
import Stream, { Readable } from 'node:stream';
import { InjectS3, S3 } from 'nestjs-s3';
import { createReadStream } from 'node:fs';
import { readdir, rm } from 'node:fs/promises';
import promisifyCommand from './utils/promisifyCommand';
import { ConfigService } from '@nestjs/config';
import { ETrackStatuses } from './trackStatuses';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectS3() private readonly s3: S3,
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.kafkaService.connect();
  }

  async getVideoReadableStream(link: string) {
    const id = new URLSearchParams(new URL(link).searchParams).get('v');

    const instance = await Innertube.create({
      player_id: '0004de42',
    });
    console.log(id);

    const info = await instance.getBasicInfo(id!);
    const audio = await info.download();

    // const agent = createAgent();
    // let info;
    // try {
    //   info = await getInfo(link, { agent });
    // } catch (error) {
    //   console.log(error);
    //   return;
    // }

    if (getMinutes(Number(info.basic_info.duration)) > 10) {
      console.log('More than 10 minutes');
      return;
    }

    // const audio = downloadFromInfo(info, { filter: 'audioonly', agent });
    return {
      audio: Readable.from(audio),
      info: info.basic_info,
    };
  }

  async convertAudioToHls(
    input: string | Stream.Readable,
    id: string,
    targetPath: string,
  ) {
    console.log(input);

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
