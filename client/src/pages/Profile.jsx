import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // File & Upload States
  const [file, setFile] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);

  // Form Data & Status States
  const [formData, setFormData] = useState({});
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);

  // Cloudinary Upload Handler
  const handleFileUpload = async (fileToUpload) => {
    if (!fileToUpload) return;

    // Client-side size validation (2 MB limit)
    if (fileToUpload.size > 2 * 1024 * 1024) {
      setFileUploadError('Image must be less than 2 MB');
      return;
    }

    setUploading(true);
    setFileUploadError(false);
    setFileUploadSuccess(false);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const data = new FormData();
    data.append('file', fileToUpload);
    data.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );

      const cloudinaryData = await res.json();

      if (cloudinaryData.secure_url) {
        const newAvatarUrl = cloudinaryData.secure_url;
        setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));
        setFileUploadSuccess(true);

        // Automatically save updated avatar to backend & redux store
        dispatch(updateStart());
        const updateRes = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ avatar: newAvatarUrl }),
        });
        const updateData = await updateRes.json();
        if (updateData.success === false) {
          dispatch(updateFailure(updateData.message));
          return;
        }
        dispatch(updateSuccess(updateData));
        setUserUpdateSuccess(true);
      } else {
        setFileUploadError(cloudinaryData.error?.message || 'Error uploading image to Cloudinary');
      }
    } catch (err) {
      setFileUploadError('Cloudinary connection error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }
      dispatch(updateSuccess(data));
      setUserUpdateSuccess(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    dispatch(deleteStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess(data));
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    dispatch(signOutStart());
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {/* Hidden File Input */}
        <input
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
              handleFileUpload(selectedFile);
            }
          }}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />

        {/* Profile Avatar Clickable Preview */}
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        {/* Upload Status Feedback */}
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>{fileUploadError}</span>
          ) : uploading ? (
            <span className='text-slate-700'>Uploading image to Cloudinary...</span>
          ) : fileUploadSuccess ? (
            <span className='text-green-700'>Image uploaded & saved successfully!</span>
          ) : (
            ''
          )}
        </p>

        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button
          disabled={loading || uploading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
        <Link to={'/create-listing'} className='w-full'>
          <button type='button' className='bg-green-700 text-white w-full rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
            Create Listing
          </button>
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {userUpdateSuccess ? 'User updated successfully!' : ''}
      </p>
    </div>
  );
}