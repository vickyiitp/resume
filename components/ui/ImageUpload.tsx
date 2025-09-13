import React from 'react';
import { UserIcon } from '../icons/UserIcon';
import Button from './Button';

interface ImageUploadProps {
  photo: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ photo, onPhotoChange, onPhotoRemove }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Profile Photo</label>
      <div className="mt-1 flex items-center gap-4">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center ring-1 ring-slate-200">
          {photo ? (
            <img src={photo} alt="Profile Preview" className="h-full w-full object-cover" />
          ) : (
            <UserIcon className="h-12 w-12 text-slate-400" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-white py-2 px-3 border border-slate-300 rounded-md shadow-sm text-sm leading-4 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <span>{photo ? 'Change Photo' : 'Upload Photo'}</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={onPhotoChange} />
          </label>
          {photo && (
            <Button variant="secondary" onClick={onPhotoRemove} className="text-xs py-1 px-2 h-auto">
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
