
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol";

interface IMagicOracleVRF {
    function getTextResponse(uint256 _requestId) 
        external
        view
        returns (string memory);

    function requestRandomWords() external returns (uint256);

    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (bool fulfilled, uint256[] memory randomWords);

}

contract MagicOracleNFT is ERC721URIStorage, ConfirmedOwner {
    event RequestSent(address indexed sender, uint256 requestId, string question);

    uint256 public tokenCounter;
    //requestID => sender
    mapping(uint256 => address) public requestIdToSender;
    //requestID => token counter
    mapping(uint256 => uint256) public requestIdToTokenId;
    //requestID => question string
    mapping(uint256 => string) public requestIdToQuestion;
    //list of all requests by user
    mapping (address => uint256[]) public userRequestIds;
    //requestId => mint status
    mapping (uint256 => bool) public requestIdToMinted;
    //count requestIds of user
    mapping (address => uint256) public userRequestIdCounter;
    //array of minted requestIds
    questionData[10] public mintedQuestions;
    //price to ask question
    uint256 public questionPrice;
    //price to mint answer
    uint256 public mintPrice;
    
    IMagicOracleVRF magicOracleVRF;

    struct questionData {
    uint256 requestId; 
    string question; 

    }  
    
    constructor()
        ConfirmedOwner(msg.sender)
        ERC721("MagicOracle.link", "MAGIC_ORACLE") {

        }

    function withdraw() public onlyOwner {
       require(payable(msg.sender).send(address(this).balance));
    }

    function setQuestionPrice(uint256 _price) public onlyOwner {
        questionPrice = _price;
    }

    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }

    function setMagicOracle(address _magicOracle) public onlyOwner {
        magicOracleVRF = IMagicOracleVRF(_magicOracle);
    }

    function getMints() public view  returns (questionData[10] memory) {
        return mintedQuestions;
    }
    


    function askQuestion(string memory _question) public payable returns (uint256){
        require(msg.value >= questionPrice); 

        uint256 requestId = magicOracleVRF.requestRandomWords();

        requestIdToSender[requestId] = msg.sender;
        userRequestIds[msg.sender].push(requestId);
        requestIdToQuestion[requestId] = _question;

        userRequestIdCounter[msg.sender]++;        
        emit RequestSent(msg.sender, requestId, _question);
        return requestId;

    }

    

    function finishMint(uint256 _requestId) public payable {
        require(msg.value >= mintPrice); 
        
        require(requestIdToSender[_requestId] == msg.sender, "User => RequestID match not found!");
        require(requestIdToMinted[_requestId] == false, "RequestID already minted!");
        (bool fulfilled, ) = magicOracleVRF.getRequestStatus(_requestId);
        require(fulfilled == true, "RequestID not fulfilled!");

        if (mintedQuestions.length >= 10) {
        mintedQuestions = removeFirst(mintedQuestions);
        }
        mintedQuestions[9] = questionData(_requestId, requestIdToQuestion[_requestId]);

        requestIdToTokenId[_requestId] = tokenCounter;
        requestIdToMinted[_requestId] = true;

        _safeMint(msg.sender, tokenCounter);
        string memory imageURI = generateSVG(requestIdToQuestion[_requestId], _requestId);
        _setTokenURI(tokenCounter, formatTokenURI(imageURI));

        tokenCounter = tokenCounter + 1;
    }

    function generateSVG(string memory _question, uint256 _requestId)
        public
        view
        returns (string memory)
    {

        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        "<svg class = 'svgText' width='350' height='350' viewBox='0 0 350 350' xmlns='http://www.w3.org/2000/svg'>",
                        "<rect x='0' y='0' width= '350' height='350' rx='10' class='svgBody'/>",
                        "<text class= 'large' x='20' y='40'>",
                        "&lt;-&gt;",
                        "</text>",
                        "<text x='25' y='70' class='small'>",
                        "0x", addressToString(requestIdToSender[_requestId]),
                        "</text>",
                        "<text class='' x='30' y='100' >",
                        "asks...",
                        "</text>",
                        "<foreignObject class='svgText' x='30' y='120' width='300' height='74'>",
                        "<p  class='svgText' style='color: #3FA0F1' xmlns='http://www.w3.org/1999/xhtml'>",
                        _question,
                        "</p>",
                        "</foreignObject>",
                        "<text x='25' y='220' >",
                        "The Magic Oracle repsonds...",
                        "</text>",
                        "<text class='medium' x='30' y='260' >",
                        magicOracleVRF.getTextResponse(_requestId),
                        "</text>",
                        "<text class= 'large' x='20' y='310' >",
                        "&lt;/&gt;",
                        "</text>",
                        "<style>",
                        ".svgBody {fill: #ffffff; stroke: #3FA0F1; stroke-width:5} .svgText {font-family: 'monospace'; fill: #3FA0F1; font-weight: bold} .small {font-size: 12px} .large {font-size: 26; font-weight: bold; fill: black; font-family: 'monospace'} .medium {font-size: 16px}",
                        "</style>",
                        "</svg>"
                    )
                )
            )
        );
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    function formatTokenURI(string memory imageURI)
        public
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                "MagicOracle.link", 
                                '", "description":"The Magic Oracle says...", "attributes":"", "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    /*HELPER FUNCTIONS */
    
    function addressToString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint256(uint160(x)) / (2**(8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function removeFirst(questionData[10] storage _array) internal returns (questionData[10] storage) {
        if (_array.length > 0) {
                for (uint i = 0; i < _array.length -1; i++) {
                    _array[i] = _array[i+1];
                }
        }
        return _array;
    }

}
