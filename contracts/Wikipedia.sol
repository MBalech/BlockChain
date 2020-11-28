pragma solidity ^0.5.0;

contract Wikipedia {
  //Structure de l'article
  struct Article {
    string content;
  }

  //Tableau contenant les différents identifiants
  uint[] public ids;

  //Tableau des articles
  mapping (uint => Article) public articlesById;

  //Tableau permettant de récupérer le dernier identifiant de l'historique d'un article
  mapping (uint => uint) public idsCountHistory;

  //Tableau contenant toutes les modifications par article
  mapping (uint => mapping(uint => Article)) public articlesHistory;

  //Constructeur, crée le premier article à l'appel du contrat la première fois
  constructor() public {
    uint index = 0;
    ids.push(index);
    Article memory newArticle = Article("This is your first article in your contract");
    articlesById[index] = newArticle;
  }

  //Permet de récupérer le contenu d'un article en fonction de son identifiant
  function articleContent(uint index) public view returns (string memory) {
    return articlesById[index].content;
  }

  //Récupère tous les ids
  function getAllIds() public view returns (uint[] memory) {
    return ids;
  }

  //Création d'un nouvel article
  function createArticle(string memory contenu) public{
    Article memory newArticle = Article(contenu);
    uint  index = ids.length;
    ids.push(index);
    articlesById[index] = newArticle;
    idsCountHistory[index] = 0;
  }

  //Modification de l'article en fonction de son identifiant
  function modifyArticle(uint id,string memory contenu) public{
    //Enregistrement de l'historique
    uint index = idsCountHistory[id];
    articlesHistory[id][index] = articlesById[id];
    idsCountHistory[id] = index +1;

    Article memory newArticle = Article(contenu);
    articlesById[id] = newArticle;
  }

  //Retourne le nombre d'historique créé pour l'article
  function getNumberHistorical(uint id) public view returns (uint){
    return idsCountHistory[id];
  }

  //Retourne l'historique d'un article en fonction de l'identifiant de l'article et du numéro de l'historique
  function getHistorical(uint id, uint num) public view returns (string memory){
    return articlesHistory[id][num].content;
  }
}
