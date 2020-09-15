<template>
  <v-row justify="center">
    <v-dialog :value="isShow" persistent max-width="450">
      <v-card>
        <v-card-title class="headline">UPDATE TRACK FILE</v-card-title>
        <v-card-text>
          <v-img :src="updateTrackInput.albumArt.src || track.albumArtPath"></v-img>
          <v-file-input
            v-model="updateTrackInput.file"
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-3" text @click="onClose">취소</v-btn>
          <v-btn color="green darken-1" text @click="submit()">수정</v-btn>
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
export default class UpdateTrackFileModal extends Vue {
  /******************************************************************
   * Store
   * ****************************************************************/
  @Action(TracksActionTypes.UPDATE_TRACK_FILE, { namespace: 'tracks' }) private updateTrackFile!: (
    track: Track
  ) => ResponseBody;
  /******************************************************************
   * Props & Emit
   * ****************************************************************/
  @Prop(Boolean) private readonly isShow?: boolean;
  @Prop(Object) private readonly track?: Track;
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
  private updateTrackInput: Track = new TrackVo(null);

  private formHasErrors = false;

  get form() {
    return {
      file: this.updateTrackInput.file,
    };
  }

  /******************************************************************
   * Life Cycles
   * ****************************************************************/
  private created() {
    this.updateTrackInput = new TrackVo(this.track);
  }

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
      const body = await this.updateTrackFile(this.updateTrackInput);
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
    const { image } = tags;
    if (image) {
      const blob = new Blob([image?.imageBuffer as BlobPart], { type: `image/${image?.mime}` });
      this.updateTrackInput.albumArt.file = blob;
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);
      this.updateTrackInput.albumArt.src = imageUrl;
      this.updateTrackInput.albumArt.name = `${name}.${image.mime}` as string;
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
    this.updateTrackInput = new TrackVo(null);
    this.formHasErrors = false;
  }
}
</script>
