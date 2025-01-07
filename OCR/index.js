import fs from 'node:fs';
import sizeOf from 'image-size';
import getOCR from './getOCR.js';

// get height and width of screenshot
const dimensions = sizeOf('./OCR/assets/04.jpg');
console.log(dimensions);

getOCR('./OCR/assets/04.jpg');
