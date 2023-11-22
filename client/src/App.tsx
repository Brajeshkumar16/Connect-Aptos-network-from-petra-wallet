import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin, List, Checkbox, Input } from "antd";

import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { SomeAptosWallet } from "some-aptos-wallet-package";
// import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { AptosClient } from "aptos";
import { Provider, Network } from "aptos";

type Task = {
  address: string;
  completed: boolean;
  content: string;
  task_id: string;
};

type User={
  id: number;
  name:string;
  count:number;
}

// // change
// const wallets = [new AptosWallet()];

// <AptosWalletAdapterProvider
//   plugins={wallets}
//   autoConnect={true}
//   onError={(error) => {
//     console.log("error", error);
//   }}
// >
//   <App />
// </AptosWalletAdapterProvider>;


// const {
//   connect,
//   account,
//   network,
//   connected,
//   disconnect,
//   wallet,
//   wallets,
//   signAndSubmitTransaction,
//   signAndSubmitBCSTransaction,
//   signTransaction,
//   signMessage,
//   signMessageAndVerify,
// } = useWallet();


// const aptosConfig = new AptosConfig({ network: Network.TESTNET });
// const aptos = new Aptos(aptosConfig);

// const onConnect = async (walletName) => {
//   await connect(walletName);
// };

// <button onClick={() => onConnect(wallet.name)}>{wallet.name}</button>;

// <button onClick={disconnect}>Disconnect</button>


// const onSignAndSubmitTransaction = async () => {
//   const response = await signAndSubmitTransaction({
//     sender: account.address,
//     data: {
//       function: "0x1::coin::transfer",
//       typeArguments: ["0x1::aptos_coin::AptosCoin"],
//       functionArguments: [account.address, 1],
//     },
//   });
//   // if you want to wait for transaction
//   try {
//     await aptos.waitForTransaction({ transactionHash: response.hash });
//   } catch (error) {
//     console.error(error);
//   }
// };

// <button onClick={onSignAndSubmitTransaction}>
//   Sign and submit transaction
// </button>;



// const onSignAndSubmitBCSTransaction = async () => {
//   const response = await signAndSubmitTransaction({
//     sender: account.address,
//     data: {
//       function: "0x1::coin::transfer",
//       typeArguments: [parseTypeTag(APTOS_COIN)],
//       functionArguments: [AccountAddress.from(account.address), new U64(1)],
//     },
//   });
//   // if you want to wait for transaction
//   try {
//     await aptos.waitForTransaction({ transactionHash: response.hash });
//   } catch (error) {
//     console.error(error);
//   }
// };

// <button onClick={onSignAndSubmitTransaction}>
//   Sign and submit BCS transaction
// </button>;











//new
export const provider = new Provider(Network.DEVNET);
export const moduleAddress = "0x7a32edb05b6fd5f478c94c732d28bec5a89111430c76a98450ee60950c90fbd2";

export const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
export const client = new AptosClient(NODE_URL);

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  // const { account, signAndSubmitTransaction } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);
  // const[count, setCount] = useState(0)
  const { account, signAndSubmitTransaction } = useWallet();
  // const[count2, setCount2] = useState(0)

  const initialUsers:User[] = [{id:1, name:"User1", count:0},{id:2, name:"User2", count:0}]

  
  const [users, setUsers] = useState<User[]>(()=>{
    const savedUsers = JSON.parse(localStorage.getItem('users') || 'null');
    return savedUsers || initialUsers;
  })



  const onWriteTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewTask(value);
  };

  const fetchList = async () => {
    if (!account) return [];
    try {
      const TodoListResource = await provider.getAccountResource(
        account?.address,
        `${moduleAddress}::todolist::TodoList`
      );
      setAccountHasList(true);
      // tasks table handle
      const tableHandle = (TodoListResource as any).data.tasks.handle;
      // tasks table counter
      const taskCounter = (TodoListResource as any).data.task_counter;

      let tasks = [];
      let counter = 1;
      while (counter <= taskCounter) {
        const tableItem = {
          key_type: "u64",
          value_type: `${moduleAddress}::todolist::Task`,
          key: `${counter}`,
        };
        const task = await provider.getTableItem(tableHandle, tableItem);
        tasks.push(task);
        counter++;
      }
      // set tasks in local state
      setTasks(tasks);
    } catch (e: any) {
      setAccountHasList(false);
    }
  };

  // const fetchList = async () => {
  //   if (!account) return [];
  //   try {
  //     const todoListResource = await client.getAccountResource(
  //       account?.address,
  //       `${moduleAddress}::todolist::TodoList`
  //     );

  //     // console.log(todoListResource)
  //     setAccountHasList(true);
  //     // tasks table handle
  //     const tableHandle = (todoListResource as any).data.tasks.handle;
  //     // tasks table counter
  //     const taskCounter = (todoListResource as any).data.task_counter;

  //     let tasks = [];
  //     let counter = 1;
  //     while (counter <= taskCounter) {
  //       const tableItem = {
  //         key_type: "u64",
  //         value_type: `${moduleAddress}::todolist::Task`,
  //         key: `${counter}`,
  //       };
  //       const task = await client.getTableItem(tableHandle, tableItem);
  //       tasks.push(task);
  //       counter++;
  //     }
  //     // set tasks in local state
  //     setTasks(tasks);
  //     console.log(tasks)
  //   } catch (e: any) {
  //     setAccountHasList(false);
  //   }
  // };

  // const addNewList = async () => {
  //   if (!account) return [];
  //   setTransactionInProgress(true);
  //   // build a transaction payload to be submited
  //   const payload = {
  //     type: "entry_function_payload",
  //     function: `${moduleAddress}::todolist::create_list`,
  //     type_arguments: [],
  //     arguments: [],
  //   };

  //   console.log(payload);
  //   console.log("hello");
  //   try {
  //     // sign and submit transaction to chain
  //     const response = await signAndSubmitTransaction(payload);
  //     console.log(response)
  //     // wait for transaction
  //     await client.waitForTransaction(response.hash);
  //     setAccountHasList(true);
  //     console.log(accountHasList)
  //   } catch (error: any) {
  //     setAccountHasList(false);
  //   } finally {
  //     setTransactionInProgress(false);
  //     }

  //     // console.log(setAccountHasList);
  // };

  const addNewList = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::todolist::create_list`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const onTaskAdded = async () => {
    // check for connected account
    if (!account) return;
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::todolist::create_task`,
      type_arguments: [],
      arguments: [newTask],
    };

    // hold the latest task.task_id from our local state
    const latestId = tasks.length > 0 ? parseInt(tasks[tasks.length - 1].task_id) + 1 : 1;

    // build a newTaskToPush object into our local state
    const newTaskToPush = {
      address: account.address,
      completed: false,
      content: newTask,
      task_id: latestId + "",
    };

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);

      // Create a new array based on current state:
      let newTasks = [...tasks];

      // Add item to the tasks array
      newTasks.push(newTaskToPush);
      // Set state
      setTasks(newTasks);
      // clear input text
      setNewTask("");
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const onCheckboxChange = async (
    event: CheckboxChangeEvent,
    taskId: string
  ) => {
    if (!account) return;
    if (!event.target.checked) return;
    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function:
        `${moduleAddress}::todolist::complete_task`,
      type_arguments: [],
      arguments: [taskId],
    };

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);

      setTasks((prevState) => {
        const newState = prevState.map((obj) => {
          // if task_id equals the checked taskId, update completed property
          if (obj.task_id === taskId) {
            return { ...obj, completed: true };
          }

          // otherwise return object as is
          return obj;
        });

        return newState;
      });
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // const increaseCount = ()=>{
  //   const newCount = count+1;
  //   setCount(newCount);
  //   localStorage.setItem('count', newCount.toString())
  // }

  // const increaseCount2 = ()=>{
  //   const newCount2 = count2+1;
  //   setCount2(newCount2);
  //   localStorage.setItem('count2', newCount2.toString())
  // }


  

  const increaseCount = (userId:number)=>{
    setUsers((prevUsers)=> prevUsers.map((user)=> user.id === userId? {...user, count:user.count+1}:user))
  }

  const sortedUsers= [...users].sort((a,b)=>b.count-a.count)

  useEffect(() => {
    fetchList();
    // const savedCount = localStorage.getItem('count')
    // if(savedCount){
    //   setCount(parseInt(savedCount,10));
    // }

    // const savedCount2= localStorage.getItem('count2')
    // if(savedCount2){
    //   setCount2(parseInt(savedCount2,10));
    // }

    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>IIT Bombay Project</h1>
            <h2>Brajesh Kumar</h2>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector/>
          </Col>
        </Row>
      </Layout>
      <Spin spinning={transactionInProgress}>
        {
          !accountHasList ? (
            <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
              <Col span={8} offset={8}>
                {/* <Button
                  disabled={!account}
                  block
                  onClick={addNewList}
                  type="primary"
                  style={{ height: "40px", backgroundColor: "#3f67ff" }}
                >
                  Count+
                </Button> */}
                {/* <div>{count}</div>
                <Button onClick={increaseCount}>User 1</Button>

                <div>{count2}</div>
                <Button onClick={increaseCount2}>User 2</Button> */}

                <div style={{display:"flex", gap:"80px", justifyContent:"center"}}>
                  {users.map((user)=>(
                    <div style={{}} key={user.id}>
                      <div style={{fontSize:"20px", fontWeight:"bold"}}>User: {user.id}  </div>
                      <div style={{fontSize:"40px", marginLeft:"20px"}}>{user.count}</div>
                      <button style={{padding:"2rem 1rem", borderRadius:"80%", border:"none", backgroundColor:"red", color:"white", fontWeight:"bold"}} onClick={()=> increaseCount(user.id)}>Count++</button>
                    </div>
                  ))}
                </div>


                <div style={{color:"blue", fontWeight:"bold", fontSize:"20px", marginTop:"20px"}}>Leaderboard</div>
                
                  {sortedUsers.map((user)=>(
                    <div key={user.id}>
                      <div style={{fontWeight:"bold", border:"1px solid black", padding:".5rem 1rem"}}>{user.name}:--------------- {user.count}</div>
                      </div>
                  ))}
                

              </Col>
            </Row>
          ) : (
            <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
              <Col span={8} offset={8}>
                <Input.Group compact>
                  <Input
                    onChange={(event) => onWriteTask(event)} // add this
                    style={{ width: "calc(100% - 60px)" }}
                    placeholder="Add a Task"
                    size="large"
                    value={newTask} // add this
                  />
                  <Button
                    onClick={onTaskAdded} // add this
                    type="primary"
                    style={{ height: "40px", backgroundColor: "#3f67ff" }}
                  >
                    Add
                  </Button>
                </Input.Group>
              </Col>

              <Col span={8} offset={8}>
                {tasks && (
                  <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task: any) => (
                      <List.Item
                        actions={[
                          <div>
                            {task.completed ? (
                              <Checkbox defaultChecked={true} disabled />
                            ) : (
                              <Checkbox
                                onChange={(event) =>
                                  onCheckboxChange(event, task.task_id)
                                }
                              />
                            )}
                          </div>,
                        ]}
                      >
                        <List.Item.Meta
                          title={task.content}
                          description={
                            <a
                              href={`https://explorer.aptoslabs.com/account/${task.address}/`}
                              target="_blank"
                            >{`${task.address.slice(0, 6)}...${task.address.slice(-5)}`}</a>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Col>
            </Row>
          )
        }
      </Spin>
    </>
  );
}

export default App;