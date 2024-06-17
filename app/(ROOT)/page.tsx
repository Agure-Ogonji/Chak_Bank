import React from 'react'
import HeaderBox from '../../components/HeaderBox';
import TotalBalanceBox from '../../components/TotalBalanceBox';
import RightSideBar from '../../components/RightSideBar';
import { getLoggedInUser } from '../../lib/actions/user.actions';
import { getAccount, getAccounts } from '../../lib/actions/bank.actions';
import RecentTransactions from '../../components/RecentTransactions';
import TransactionsTable from '../../components/TransactionsTable';
import { Pagination } from '../../components/Pagination';
import { formatAmount } from '../../lib/utils';

const Home = async({searchParams: {id, page}}: SearchParamProps) => {

  // const currentPage = Number(page as string) || 1
  // const loggedIn = await getLoggedInUser()
  // const accounts = await getAccounts({userId: loggedIn.$id})
  // if (!accounts) return;
  // const accountsData = accounts?.data; 
  // const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId

  // const account = await getAccount({appwriteItemId})
  // console.log({
  //   accountsData,
  //   account
  // });
  
  const currentPage = Number(page as string) || 1
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({
    userId: loggedIn.$id
  })

  if (!accounts) return;

  const accountsData = accounts?.data
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId

  const account = await getAccount({appwriteItemId})

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage)

  const indexOfLastTransaction = currentPage * rowsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage

  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )
  return (
    <section className='home'>
    <div className='transactions home-content'>
      <header className='home-header'>
        <HeaderBox type="greeting" title="Karibu" user={loggedIn?.firstName || 'Guest'} subtext='Access, Manage your Account and Transactions Effectively'/>

        <TotalBalanceBox accounts={accountsData} totalBanks={accounts?.totalBanks} totalCurrentBalance={accounts?.totalCurrentBalance}/>
      </header>
    <div className='space-y-6'>
      <div className=''>
        <div className='flex flex-col gap-2'>
          <RecentTransactions accounts={accountsData} transactions={account?.transactions} appwriteItemId={appwriteItemId} page={currentPage}/>
        </div>

        {/* <div className='transactions-account-balance'>
          <p className='text-14'>Current Balance</p>
          <p className='text-24 text-center font-bold'>{formatAmount(account?.data.currentBalance)}</p>
        </div> */}
      </div>
      {/* <section className='flex w-full flex-col gap-6'>
        <TransactionsTable transactions={currentTransactions}/>
        {totalPages > 1 && (
          <div className='my-4 w-full'>
            <Pagination totalPages={totalPages} page={currentPage}/>
          </div>
        )}
      </section> */}
    </div>
  </div>
    <RightSideBar user={loggedIn} transactions={account?.transactions} banks={accountsData?.slice(0,2)}/>
    </section>
    // <section className='home'>
    //   <div className='home-content'>
    //     <header className='home-header'>
    //       <HeaderBox type="greeting" title="Karibu" user={loggedIn?.firstName || 'Guest'} subtext='Access, Manage your Account and Transactions Effectively'/>

    //       <TotalBalanceBox accounts={accountsData} totalBanks={accounts?.totalBanks} totalCurrentBalance={accounts?.totalCurrentBalance}/>
    //     </header>
    //     <RecentTransactions accounts={accountsData} transactions={account?.transactions} appwriteItemId={appwriteItemId} page={currentPage}/>
    //     <section className='flex w-full flex-col gap-6'>
    //       <TransactionsTable transactions={currentTransactions}/>
    //       {totalPages > 1 && (
    //         <div className='my-4 w-full'>
    //           <Pagination totalPages={totalPages} page={currentPage}/>
    //         </div>
    //       )}
    //     </section>
    //   </div>

    //   <RightSideBar user={loggedIn} transactions={account?.transactions} banks={accountsData?.slice(0,2)}/>
    // </section>

  )
}

export default Home

