import { Request, Response } from "express";
import { SlackRequest, SlackResponse } from '../interfaces';
import { pluck, weightedPluck, randomInt } from "ossuary/dist/lib/Random";
import Parser from "ossuary/dist/lib/Parser";
import config from '../config';
import dictionary from '../dictionary';
import { capitalize } from 'lodash';

const ARTIST_IS_ALBUM_TITLE_CHANCE = 80;
const ALBUM_IS_SONG_TITLE_CHANCE = 65;
const MULTIPART_OMG_CHANCE = 80;

class Proggology {

  private parser: Parser;

  constructor () {
    this.parser = new Parser(dictionary);
  }

  /**
   * This does all the route handling and magic stuff happens
   * @param req
   * @param res
   */
  async handle (req: Request, res: Response): Promise<void> { // < This has to resolve a promise according to some dumb stuff
    const body: SlackRequest = req.body;
    // String all string-quoted
    let { text } = body;
    let response: SlackResponse;

    response = {
      text: this.getText(),
      response_type: "in_channel"
    };

    res.json(response);
  }

  getText() {
    const ARTIST_IS_ALBUM_TITLE = randomInt(0, 100) > ARTIST_IS_ALBUM_TITLE_CHANCE;
    const ALBUM_IS_SONG_TITLE = randomInt(0, 100) > ALBUM_IS_SONG_TITLE_CHANCE;
    const MULTIPART_OMG = randomInt(0, 100) > MULTIPART_OMG_CHANCE;

    let artist = magic(this.parser.recursiveslyParse(`[artists]`));

    let songs: any = [];
    let maxLength = 0;
    const numberOfSongs = randomInt(3, 12);
    for (let i = 0; i < numberOfSongs; i++) {
      const songTitle = magic(this.parser.recursiveslyParse('[songs]'));
      if (songTitle.length > maxLength) {
        maxLength = songTitle.length;
      }
      songs.push(songTitle);
    }

    let album: string;
    if (ARTIST_IS_ALBUM_TITLE) {
      album = artist;
    } else if (ALBUM_IS_SONG_TITLE) {
      album = songs[randomInt(0, songs.length - 1)];
    } else if (ARTIST_IS_ALBUM_TITLE && ALBUM_IS_SONG_TITLE) {
      album = artist = songs[randomInt(0, songs.length - 1)];
    } else {
      album = magic(this.parser.recursiveslyParse(`[albums]`));
    }

    if (MULTIPART_OMG) {
      const multiPartLength = randomInt(2, songs.length);
      let multiPartTitle: string;
      if (ARTIST_IS_ALBUM_TITLE) {
        multiPartTitle = artist;
      } else if (ARTIST_IS_ALBUM_TITLE && !ALBUM_IS_SONG_TITLE) {
        multiPartTitle = album;
      } else {
        multiPartTitle = songs[randomInt(0, songs.length - 1)];;
      }
      songs = songs.map((song: string, index: number) => {
        return index <= multiPartLength
          ? song
          : `${multiPartTitle} Pt. ${index - multiPartLength}`
      });
    }

    songs = songs.map((song: any, index: any) => {
      const minutes = randomInt(1, 30);
      let seconds: any = randomInt(0, 60).toString().padStart(2, '0');
      const padding = maxLength >= 45 ? maxLength + 5 : 45;
      return `${index + 1}.`.padEnd(numberOfSongs >= 10 ? 4 : 3) + `${song}`.padEnd(padding) + `${minutes}:${seconds}`;
    });

    // console.log({
    //   ARTIST_IS_ALBUM_TITLE, ALBUM_IS_SONG_TITLE, MULTIPART_OMG, numberOfSongs, maxLength
    // });

    return `*Artist:* ${artist}\n*Album:* ${album}\n*Tracklist:*\n${'```\n' + songs.join('\n') + '\n```'}`;
  }
}

function magic (str: string): string {
  let a: any = str.split(' ');
  return a.map((b: string) => capitalize(b)).join(' ');
}

export default Proggology;
