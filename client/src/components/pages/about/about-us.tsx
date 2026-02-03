import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className=' p-12'>
      <h1 className='text-3xl ml-5 font-semibold mb-4'>About Hyper</h1>
      <div className='flex flex-col md:flex-row space-x-0 md:space-x-8'>
        <div className='md:w-1/2 ml-5 '>
          <img
            src='https://res.cloudinary.com/dwucedjmy/image/upload/v1691134082/photo-1524178232363-1fb2b075b655_enawoh.avif'
            alt='About Hyper'
            className='rounded-lg  w-10/12 shadow-md'
          />
        </div>
        <div className='md:w-1/2 mt-5 md:mt-0'>
          <p className='text-gray-600 mb-4'>
            Welcome to Hyper, your ultimate destination for online shopping. We're on a mission to bring good products to your
            fingertips, connecting passionate customers with passionate sellers from around the world.
          </p>
          <p className='text-gray-600 mb-4'>
            Our platform offers a diverse range of products, both free and paid,
            to cater to your needs. From new technology products to
            advancing your experience, Hyper provides you with a dynamic
            choices that fits your lifestyle.
          </p>
          <p className='text-gray-600 mb-4'>
            Hyper is more than an online store — it’s a shopping community. Engage with
            fellow shoppers and trusted sellers, explore curated collections, share
            reviews, and exchange shopping insights in our community spaces. Want real-time
            interaction? Our live channels bring sellers and products closer to you.
          </p>
          <p className='text-gray-600'>
            Join Hyper today and enjoy a smarter, more connected way to shop. Discover,
            share, and shop with confidence — together!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;



























