import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure } from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
      setUpdateSuccess(true);
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
  }

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
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <img
          src={currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover self-center mt-2'
        />

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
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User updated successfully' : ''}</p>
    </div>
  );
}