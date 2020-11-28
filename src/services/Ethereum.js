import Web3 from 'web3'
import ContractInterface from '../build/contracts/Wikipedia.json'
import { getAllArticlesStore, connectEthereum, updateHistorical } from '../store/reducers/root'
import store from '../store'
import Fortmatic from 'fortmatic'

const connect = async dispatch => {
  if (window.ethereum) {

    //Création du noeud pour fortmatic
    const customNodeOptions = {
      rpcUrl: 'http://127.0.0.1:7545', // url du noeud
      chainId: 0x539 // chainId du noeud
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

      const allarticles = await getAllArticles(contract);
      const historical = await getHistorical(contract);

      dispatch(connectEthereum({ account, contract})); // modification de l'état
      dispatch(getAllArticlesStore({allarticles})); // modification de l'état
      dispatch(updateHistorical({historical})); // modification de l'état
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log('Not Dapp browser.')
  }
}

const saveArticle = (article) => async dispatch => {
  if(article != null) {
    const { contract } = store.getState() // récupération du contract
    await contract.methods.createArticle(article.toString()).send(); // création de l'article dans le contrat

    // Récupération de tous les articles pour mettre à jour suite à l'insertion du dernier
    const allarticles = getAllArticles(contract);
    dispatch(getAllArticlesStore({ allarticles })); // modification de l'état
  }
}

const modifyArticle = (id,article) => async dispatch => {
  const { contract } = store.getState() // Récupération du contrat

  // Envoie de la mise à jour
  await contract.methods.modifyArticle(id,article.toString()).send(); // Envoie de la modification du contenu

  // Mise à jour des articles dans l'application
  const allarticles = getAllArticles(contract);
  dispatch(getAllArticlesStore({allarticles})); // Mise à jour de l'état

  // Mise à jour de l'historique de l'application
  const historical = await getHistorical(contract);
  dispatch(updateHistorical({historical})); // mise à jour de l'état
}

//Création du tableau de tous les articles
async function getAllArticles (contract) {
  const ids = await contract.methods.getAllIds().call(); // récupération de tous les ids
  var allarticles = [];
  for (var i = 0; i < ids.length; i++) {
    const article = await contract.methods.articleContent(ids[i]).call(); // // récupération de l'article par son id
    allarticles.push({ id: ids[i], article: article }); // insertion de l'article dans le tableau
  }

  return allarticles;
}

//Création du tableau des historique
async function getHistorical(contract){
  const ids = await contract.methods.getAllIds().call(); // récupération de tous les ids
  const historical = [];
  for(var i = 0; i < ids.length; i++){
    const numHisto = await contract.methods.getNumberHistorical(ids[i]).call(); // récupération du nombre d'historique par article
    const articles = [];
    for(var j = 0; j < numHisto; j++){
      const hist = await contract.methods.getHistorical(ids[i], j).call(); // récupération de l'historique en fonction du numéro et de l'article
      articles.push(hist);
    }
    historical.push({id : ids[i], articlesHisto: articles}); // insertion de l'historique dans le tableau
  }

  return historical;
}


export { connect, saveArticle,modifyArticle }
