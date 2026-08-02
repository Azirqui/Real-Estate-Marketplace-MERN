import React from 'react'

export default function Profile() {
  const handleGoogleClick = async () => {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error('Error during Google OAuth:', error)
    }
  }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Continue with google</button>
  )
}
