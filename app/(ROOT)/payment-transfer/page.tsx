import React from 'react'
import { getLoggedInUser } from '../../../lib/actions/user.actions'
import { getAccounts } from '../../../lib/actions/bank.actions'
import HeaderBox from '../../../components/HeaderBox'
import PaymentTransferForm from '../../../components/PaymentTransferForm'

const Transfer = async() => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({
    userId: loggedIn.$id
  })

  if (!accounts) return;

  const accountsData = accounts?.data
  return (
    <section className='payment-transfer'>
      <HeaderBox title='Payment Transfer' subtext='Please Provide Any Specific  Details or Notes Related to The Payment Transfer'/>

      <section className='size-full pt-5'>
        <PaymentTransferForm accounts={accountsData}/>
      </section>
    </section>
  )
}

export default Transfer