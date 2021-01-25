import { ctx } from './canvas.js';

const Utils = {
    writeText(text, x, y, args = {}) {
        const { textAlign, color, font, fontSize } = args;
        
        ctx.font = !font && !fontSize ? '35px VT323' : !font ? `${fontSize} VT323` : `35px ${font}`;
        ctx.textAlign = textAlign || 'right';
        ctx.fillStyle = color || 'black';
        ctx.fillText(text, x, y);
    }
}

export default Utils;