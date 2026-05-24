import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomization extends Document {
  userId: string;
  theme: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    fontSize: string;
  };
  background: {
    type: string;
    value: string;
    repeat: boolean;
    fixed: boolean;
  };
  profileMusic: {
    title: string;
    artist: string;
    url: string;
    autoplay: boolean;
  };
  cursor: {
    type: string;
    imageUrl?: string;
  };
  stickers: any[];
  gifs: any[];
  layoutStyle: string;
  updatedAt: Date;
}

const customizationSchema = new Schema<ICustomization>({
  userId: { type: String, required: true, unique: true },
  theme: {
    name: { type: String, default: 'classic' },
    primaryColor: { type: String, default: '#FF69B4' },
    secondaryColor: { type: String, default: '#000000' },
    accentColor: { type: String, default: '#00FFFF' },
    fontFamily: { type: String, default: 'Comic Sans MS' },
    fontSize: { type: String, default: '14px' }
  },
  background: {
    type: { type: String, default: 'color' },
    value: { type: String, default: '#000000' },
    repeat: { type: Boolean, default: false },
    fixed: { type: Boolean, default: false }
  },
  profileMusic: {
    title: String,
    artist: String,
    url: String,
    autoplay: { type: Boolean, default: true }
  },
  cursor: {
    type: { type: String, default: 'default' },
    imageUrl: String
  },
  stickers: [{ id: String, imageUrl: String, position: { x: Number, y: Number }, size: Number }],
  gifs: [{ id: String, url: String, position: String }],
  layoutStyle: { type: String, default: 'classic' }
}, { timestamps: true });

export const Customization = mongoose.model<ICustomization>('Customization', customizationSchema);
