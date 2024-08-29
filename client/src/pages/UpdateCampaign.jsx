import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
import { Button } from '@nextui-org/react';
import { SERVER_URL } from '../constants';

const UpdateCampaign = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    id : state._id,
    name: state.name,
    title: state.title,
    description: state.description,
    towards: state.towards,
    target: state.target, 
    deadline: state.deadline,
    image: state.image
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit =  () => {
    checkIfImage(form.image, async (exists) => {
      if(exists) {
        setIsLoading(true)
        
        axios.post(SERVER_URL + '/update' , form)
        .then((res)=>{
            toast.success(res.data.message)
            console.log("updated")
          })
        .catch((e)=>{
            if(e.response.status === 500)
            toast.error(e.response.data.message)
        })
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
      }
    })
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Update Campaign Details</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Campaign Creator's Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField 
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField 
            labelName="Description *"
            placeholder="Write your Campaign Description"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />

          <FormField 
            labelName="Towards *"
            placeholder="Example: Education/Charity"
            inputType="text"
            value={form.towards}
            handleChange={(e) => handleFormFieldChange('towards', e)}
          />

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Goal *"
            placeholder="$ 1500"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField 
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField 
            labelName="Campaign image URL *"
            placeholder="Place image URL for your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          />

          <div className="flex justify-center items-center mt-[40px] gap-4">
            <CustomButton 
              btnType="button"
              title="Update Campaign"
              styles="bg-[#1dc071]"
              handleClick={() => {
                setTimeout(() => {
                    handleSubmit();
                }, 500);
            }}
            />
            
            <CustomButton 
              btnType="button"
              title="Cancel"
              styles="bg-[#f31260]"
              handleClick={() => {navigate(`/campaign-details/${state.title}`, { state: state })}}
            />
            
          </div>
      </form>
    </div>
  )
}

export default UpdateCampaign