// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract MagicOracleVRF is VRFConsumerBaseV2, ConfirmedOwner{

    event RequestFulfilled(uint256 indexed requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }   

    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    //1000 gwei
    bytes32 keyHash =
        0x83d1b6e3388bed3d76426974512bb0d270e9542a765cd667242ea26c0cc0b730;
    
    uint32 callbackGasLimit = 2500000;

    uint16 requestConfirmations = 3;

    uint32 numWords = 1;


    /* requestId --> requestStatus */
    mapping(uint256 => RequestStatus) public s_requests;
    //requestId to answer from magic oracle
    mapping(uint256 => string) public requestIdToAnswer;




    //Array of responses from The Oracle
    string[] public textResponses = [
        //yes
        "It is certain.", //1
        "Absolutely.", //2
        "Without a doubt.", //3
        "Yes, definitely.", //4
        "You can count on it.", //5
        "As I see it, yes.", //6
        "Surely.", //7
        "Outlook is good.", //8
        "Very likely.", //9
        "Yes.", //10
        //maybe
        "Cannot predict now.", //11
        "Outlook is unclear.", //12
        "Perhaps.", //13
        "Ask again later.", //14
        //no
        "Doubtful.", //15
        "Don't count on it.", //16
        "Outlook isn't good.", //17
        "Nope.", //18
        "I don't think so.", //19
        "My sources say no." //20
    ];    



    constructor(uint64 subscriptionId)
        VRFConsumerBaseV2(0x6D80646bEAdd07cE68cab36c27c626790bBcf17f)
        ConfirmedOwner(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x6D80646bEAdd07cE68cab36c27c626790bBcf17f
        );
        s_subscriptionId = subscriptionId;
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() public returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        //set response from oracle in text
        requestIdToAnswer[_requestId] = requestIdToTextResponse(_requestId);

        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    function requestIdToTextResponse(uint256 _requestId)
        public
        view
        returns (string memory oracleResponse)
    {
        require(s_requests[_requestId].fulfilled, "request not fulfilled");
        RequestStatus memory request = s_requests[_requestId];
        uint256 smallRandomNumber = (request.randomWords[0] % 20);
        oracleResponse = textResponses[smallRandomNumber];

        return (oracleResponse);
    }

    function getTextResponse(uint256 _requestId) external view returns (string memory){
        return requestIdToAnswer[_requestId];
    }

    function getNumberResponse(uint256 _requestId) public view returns (uint256) {
        require(s_requests[_requestId].fulfilled, "request not fulfilled");
        RequestStatus memory request = s_requests[_requestId];
        uint256 smallRandomNumber = (request.randomWords[0] % 20);

        return smallRandomNumber;
    }


}