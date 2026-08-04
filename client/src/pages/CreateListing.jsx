import React from 'react'

export default function CreateListing() {
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col gap-4 sm:flex-row'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' placeholder='Name' id='name' className='border p-3 rounded-lg' maxLength={62} minLength={10} required />
                    <input type='text' placeholder='Description' id='description' className='border p-3 rounded-lg' required />
                    <input type='text' placeholder='Address' id='address' className='border p-3 rounded-lg' required />
                </div>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='border p-3 rounded-lg w-5 h-5' required />
                        <span>Sell</span>
                        <input type='checkbox' id='rent' className='border p-3 rounded-lg w-5 h-5' required />
                        <span>Rent</span>
                        <input type='checkbox' id='furnished' className='border p-3 rounded-lg w-5 h-5' required />
                        <span>Furnished</span>
                        <input type='checkbox' id='parking' className='border p-3 rounded-lg w-5 h-5' required />
                        <span>Parking</span>
                        <input type='checkbox' id='offer' className='border p-3 rounded-lg w-5 h-5' required />
                        <span>Offer</span>
                    </div>
                    <div className='flex flex gap-4'>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bathrooms' className='border p-3 rounded-lg w-20' min={1} max={10} required />
                            <p>Bathrooms</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bedrooms' className='border p-3 rounded-lg w-20' min={1} max={10} required />
                            <p>Bedrooms</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='regularPrice' className='border p-3 rounded-lg w-20' min={5000000} required />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>$ / month</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='discountPrice' className='border p-3 rounded-lg w-20' />
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price</p>
                                <span className='text-xs'>$ / month</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='text-gray-700 font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6 images)</span>
                    </p>
                    <div className='flex gap-4'>
                        <input type='file' id='images' className='border p-3 rounded-lg' accept='image/*' multiple required />
                        <button type='button' className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
                            Upload
                        </button>
                        <button type='submit' className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
                            Create Listing
                        </button>
                    </div>

                </div>
            </form>
        </main>
    )
}
