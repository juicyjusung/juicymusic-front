<template>
  <v-row justify="center">
    <v-dialog :value="isShow" persistent max-width="450">
      <v-card>
        <v-card-title class="headline">ADD TRACK</v-card-title>
        <v-card-text>
          <v-img v-if="addTrackInput.albumArt.src" :src="addTrackInput.albumArt.src"></v-img>
          <v-file-input
            v-model="addTrackInput.file"
            ref="file"
            accept=".mp3"
            class="my-9"
            label="Select track (.mp3)"
            show-size
            outlined
            dense
            type="file"
            @change="setMetaData"
            :rules="rules.fileRules"
            prepend-icon="fas fa-compact-disc"
          ></v-file-input>
          <v-text-field
            v-model="addTrackInput.title"
            ref="title"
            prepend-icon="fas fa-music"
            name="title"
            label="Title"
            class="input-group--focused"
            :rules="rules.titleRules"
            required
          ></v-text-field>
          <v-text-field
            v-model="addTrackInput.artist"
            ref="artist"
            prepend-icon="fas fa-user-check"
            name="artist"
            label="Artist"
            class="input-group--focused"
            :rules="rules.artistRules"
            required
          ></v-text-field>
          <v-text-field
            v-model="addTrackInput.album"
            ref="album"
            prepend-icon="fas fa-compact-disc"
            name="album"
            label="Album"
            class="input-group--focused flex"
            :rules="rules.albumRules"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-3" text @click="onClose">취소</v-btn>
          <v-btn color="green darken-1" text @click="submit()">등록</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { getKeyValue } from '@/utils/CommonUtils';
import { VForm } from '@/types/Common';
import { ResponseBody } from '@/types/Reponse';
import { Track, TrackVo } from '@/types/Track';
import { TracksActionTypes } from '@/store/tracks';
import NodeId3 from 'node-id3';

@Component({
  components: {},
})
export default class AddTrackModal extends Vue {
  /******************************************************************
   * Store
   * ****************************************************************/
  @Action(TracksActionTypes.ADD_TRACK, { namespace: 'tracks' }) private addTrack!: (track: Track) => ResponseBody;
  /******************************************************************
   * Props & Emit
   * ****************************************************************/
  @Prop(Boolean) private readonly isShow?: boolean;
  @Emit('onClose') private onClose() {
    this.init();
  }

  /******************************************************************
   * Variable
   * ****************************************************************/
  private rules = {
    fileRules: [(v: string) => !!v || 'File is required'],
    titleRules: [(v: string) => !!v || 'Title is required'],
    artistRules: [(v: string) => !!v || 'Artist name is required'],
    albumRules: [(v: string) => !!v || 'Album name is required'],
    passwordRules: [
      (v: string) => !!v || 'Please enter your password',
      (v: string) => v.length >= 8 || 'Password must be at least 8 characters long',
    ],
    confirmPassRules: [
      (v: string) => !!v || 'Please enter your password',
      (v: string) => v.length >= 8 || 'Password must be at least 8 characters long',
    ],
  };
  private addTrackInput: Track = new TrackVo(null);

  private formHasErrors = false;

  get form() {
    return {
      title: this.addTrackInput.title,
      artist: this.addTrackInput.artist,
      file: this.addTrackInput.file,
      album: this.addTrackInput.album,
    };
  }

  /******************************************************************
   * Life Cycles
   * ****************************************************************/
  private created() {}

  /******************************************************************
   * Methods
   * ****************************************************************/
  protected async submit() {
    this.formHasErrors = false;
    Object.keys(this.form).forEach((key: string) => {
      if (!getKeyValue(key)(this.form)) this.formHasErrors = true;
      const form = this.$refs[key] as VForm;
      form.validate(true);
    });
    if (this.formHasErrors) return;
    try {
      const body = await this.addTrack(this.addTrackInput);
      if (body.message) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: body.message,
        });
      } else {
        this.$notify({
          group: 'all',
          type: 'success',
          text: '트랙 추가가 완료되었습니다!',
        });
        this.onClose();
      }
    } catch (e) {
      console.error(e);
    }
  }
  async setMetaData(file: File) {
    if (!file) return this.init();
    const arrayBuffer: ArrayBuffer = (await this.readFile(file)) as ArrayBuffer;
    const tags = NodeId3.read(this.toBuffer(arrayBuffer));
    const { title, artist, album, image } = tags;
    if (title) this.addTrackInput.title = title;
    if (artist) this.addTrackInput.artist = artist;
    if (album) this.addTrackInput.album = album;
    if (image) {
      const blob = new Blob([image?.imageBuffer as BlobPart], { type: `image/${image?.mime}` });
      this.addTrackInput.albumArt.file = blob;
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);
      this.addTrackInput.albumArt.src = imageUrl;
      this.addTrackInput.albumArt.name = `${name}.${image.mime}` as string;
    }
  }

  public async readFile(src: File | Blob) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = async () => {
        resolve(reader.result as ArrayBuffer);
      };

      reader.readAsArrayBuffer(src as Blob);
    });
  }
  toBuffer(ab: ArrayBuffer) {
    const buf = Buffer.alloc(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }

  init() {
    this.addTrackInput = new TrackVo(null);
    this.formHasErrors = false;
  }
}
</script>
