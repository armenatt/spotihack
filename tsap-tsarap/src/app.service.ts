/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import getMinutes from './utils/getMinutes';
import { getInfo, downloadFromInfo, createAgent } from '@distube/ytdl-core';
import * as Ffmpeg from 'fluent-ffmpeg';
import Stream from 'node:stream';
import { InjectS3, S3 } from 'nestjs-s3';
import { createReadStream, readFileSync } from 'node:fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link/link.entity';
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
    @InjectRepository(Link) private linkRepository: Repository<Link>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.kafkaService.connect();
  }

  async checkTrackInDatabase(videoId: string) {
    const result = await this.linkRepository.findOneBy({ videoId });

    if (!result) return false;

    return result;
  }

  addToDB(link: string, id: string) {
    return this.linkRepository.save({ link, videoId: id });
  }

  async getVideoReadableStream(link: string) {
    const agent = createAgent(
      JSON.parse(readFileSync('./cookies.json').toString()),
    );
    let info;
    try {
      info = await getInfo(link, { agent });
    } catch (error) {
      console.log(error);
      return;
    }

    if (getMinutes(Number(info.formats[0].approxDurationMs)) > 10) {
      console.log('More than 10 minutes');
      return;
    }

    const audio = downloadFromInfo(info, { filter: 'audioonly', agent });
    return {
      audio,
      info: info.videoDetails,
    };
  }

  async convertAudioToHls(
    input: string | Stream.Readable,
    id: string,
    targetPath: string,
  ) {
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
          Bucket: this.configService.get('S3_BUCKET_NAME'),
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
    payload: { status: ETrackStatuses; name?: string; duration?: string },
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
