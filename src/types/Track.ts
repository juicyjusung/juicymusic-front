import { getKeyValue, updateVo } from '@/utils/CommonUtils';

export interface AlbumArt {
  name: string;
  file: Blob | null;
  src: string | null;
}

export interface Track {
  title: string;
  artist: string;
  album: string;
  albumArt: AlbumArt;
  albumArtPath: string;
  file: File | null;
  filePath: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  userId?: string | null;
}

export class TrackVo implements Track {
  public title = '';
  public album = '';
  public albumArt = {
    name: '',
    file: null,
    src: '',
  };
  public albumArtPath = '';
  public artist = '';
  public file = null;
  public filePath = '';
  public createdAt = null;
  public updatedAt = null;
  public userId = null;

  constructor(track: any | null) {
    if (track) {
      updateVo(this, track);
    }
  }
}
