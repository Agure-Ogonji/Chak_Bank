import React from 'react'
import { getLoggedInUser } from '../../../lib/actions/user.actions'
import { getAccounts } from '../../../lib/actions/bank.actions'
import HeaderBox from '../../../components/HeaderBox'
import BankCard from '../../../components/BankCard'

const MyBanks = async() => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({
    userId: loggedIn.$id
  })
  return (
    <section className='flex'>
      <div className='my-banks'>
        <HeaderBox title='My Bank Accounts' subtext='Effortlessly Manage Your Banking Activities'/>
        <div className='space-y-4'>
          <h2 className='header-2'>
            Your Cards
          </h2>
          <div className='flex flex-wrap gap-6'>
            {accounts && accounts.data.map((a: Account)=>(
              <BankCard key={accounts.id} account={a} userName={loggedIn?.firstName}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks