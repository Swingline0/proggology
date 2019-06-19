import { Request, Response } from "express";
import { SlackRequest, SlackResponse } from '../interfaces';
import { pluck, weightedPluck, randomInt } from "ossuary/dist/lib/Random";
import Parser from "ossuary/dist/lib/Parser";
import config from '../config';
import dictionary from '../dictionary';
import { capitalize } from 'lodash';

const ALBUM_IS_SONG_TITLE = 65;

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

    const artist = magic(this.parser.recursiveslyParse(`[artists]`));
    const numberOfSongs = randomInt(3, 12);
    let songs: any = [];
    for (let i = 0; i < numberOfSongs; i++) {
      songs.push(magic(this.parser.recursiveslyParse(`[songs]`)));
    }
    let album;
    if (randomInt(0, 100) > ALBUM_IS_SONG_TITLE) {
      album = songs[randomInt(0, songs.length - 1)];
    } else {
      album = magic(this.parser.recursiveslyParse(`[albums]`));
    }

    songs = songs.map((song: any, index: any) => (`${index+1}. ${song}`));

    response = {
      text: `*Artist:* ${artist}\n*Album:* ${album}\n*Tracklist:*\n${songs.join('\n')}`,
      response_type: "in_channel"
    };

    res.json(response);
  }

}

function magic (str: string): string {
  let a: any = str.split(' ');
  return a.map((b: string) => capitalize(b)).join(' ');
}

export default Proggology;
