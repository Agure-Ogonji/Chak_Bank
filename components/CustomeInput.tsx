import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Control, FieldPath, Form } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '../lib/utils'



const formSchema = authFormSchema('sign-up');
interface CustomeInput{
    control: Control<z.infer<typeof formSchema>>,
    // name: "email",
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder: string
}
const CustomeInput = ({control, name, label, placeholder}: CustomeInput) => {
  return (
    <FormField control={control} name={name} render={({field})=>
    (
        <div className='form-item'>
            <FormLabel className='form-label'>
                {label}
            </FormLabel>
            <div className='flex w-full flex-col '>
                <FormControl>
                    <Input placeholder={placeholder} type={name === 'password' ? "password" : "text"} className='input-class' {...field}/>
                </FormControl>

                <FormMessage className='form-message mt-2'/>
            </div>
        </div>
    )} />
  )
}

export default CustomeInput