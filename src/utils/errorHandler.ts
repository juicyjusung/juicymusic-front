import Vue from 'vue';
import { eventHub } from '@/utils/eventHub';

eventHub.$emit('before-request');
