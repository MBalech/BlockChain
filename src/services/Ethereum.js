import Web3 from 'web3'
import ContractInterface from '../build/contracts/Wikipedia.json'
import { getAllArticlesStore, connectEthereum, updateHistorical } from '../store/reducers/root'
import store from '../store'
import Fortmatic from 'fortmatic'

const connect = async dispatch => {
  if (window.ethereum) {

    const customNodeOptions = {
      rpcUrl: 'http://127.0.0.1:7545', // your own node url
      chainId: 0x539 // chainId of your own node
    }

    //let fm = new Fortmatic('pk_test_DA712556385A2857', customNodeOptions);
    //window.web3 = new Web3(fm.getProvider()) // Fortmatic
    window.web3 = new Web3(window.ethereum)

    try {
      //const [account]= await window.web3.eth.getAccounts(); //Fortmatic
      const [account] = await window.ethereum.enable();

      const contract = new window.web3.eth.Contract(
        ContractInterface.abi,
        ContractInterface.networks['5777'].address,
        {from : account}
      )

      const ids = await contract.methods.getAllIds().call();
      var allarticles = [];
      for(var i = 0; i < ids.length; i++){
        const article = await contract.methods.articleContent(ids[i]).call()
        allarticles.push({id : ids[i], article:article});
      }
      const historical = [];
      for(var i = 0; i < ids.length; i++){
        const numHisto = await contract.methods.getNumberHistorical(ids[i]).call();
        const articles = [];
        for(var j = 0; j < numHisto; j++){
          const hist = await contract.methods.getHistorical(ids[i], j).call();
          articles.push(hist);
        }
        historical.push({id : ids[i], articlesHisto: articles});
      }
      dispatch(connectEthereum({ account, contract}));
      dispatch(getAllArticlesStore({allarticles}));
      dispatch(updateHistorical({historical}));
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log('Not Dapp browser.')
  }
}

const saveArticle = (article) => async dispatch => {
  if(article != null) {
    const { contract } = store.getState()
    await contract.methods.createArticle(article.toString()).send();
    const ids = await contract.methods.getAllIds().call();
    var allarticles = [];
    for (var i = 0; i < ids.length; i++) {
      const article = await contract.methods.articleContent(ids[i]).call()
      allarticles.push({ id: ids[i], article: article });
    }
    dispatch(getAllArticlesStore({ allarticles }));
  }
}

const modifyArticle = (id,article) => async dispatch => {
  const { contract } = store.getState()
  await contract.methods.modifyArticle(id,article.toString()).send();
  const ids = await contract.methods.getAllIds().call();
  var allarticles = [];
  for(var i = 0; i < ids.length; i++){
    const article = await contract.methods.articleContent(ids[i]).call()
    allarticles.push({id : ids[i], article:article});
  }

  dispatch(getAllArticlesStore({allarticles}));

  const historical = [];
  for(var i = 0; i < ids.length; i++){
    const numHisto = await contract.methods.getNumberHistorical(ids[i]).call();
    const articles = [];
    for(var j = 0; j < numHisto; j++){
      const hist = await contract.methods.getHistorical(ids[i], j).call();
      articles.push(hist);
    }
    historical.push({id : ids[i], articlesHisto: articles});
  }

  dispatch(updateHistorical({historical}));
}

export { connect, saveArticle,modifyArticle }
