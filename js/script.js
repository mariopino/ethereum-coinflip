/**
 * Coin Flip main javascript file
 * 
 * Author: Mario Pino Uceda <info@quequiereshacer.es>
 * 
 */

contractAddress = '0xdf83258db88333109237b3541e204cc88549dcf5';

lastPlayedGamesLimit = 10;

totalGameCount = 0;

AudioOn = true;

// Sound paths
winSound = "sound/smb3_coin.wav";
loseSound = "sound/fail-buzzer-04.wav"

// Prevent process a already processed Status Event 
processedBlocks = new Array();
 
 
/* web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.133:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0]; */

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  window.web3 = new Web3(web3.currentProvider);
} else {
  console.log('Error! You must install Metamask in order to play the game!')
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  //window.web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.133:8545"));
  
  $("#alert").removeClass( "alert-success" ).addClass( "alert-danger" );
  $("#alertText").html('Error! You must install Metamask in order to play the game!');
  $("#alert").show(); 
  
}

var CoinFlipContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"Play","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"depositFunds","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getGameEntry","outputs":[{"name":"addr","type":"address"},{"name":"blocknumber","type":"uint256"},{"name":"blocktimestamp","type":"uint256"},{"name":"bet","type":"uint256"},{"name":"prize","type":"uint256"},{"name":"winner","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MaxAmountToBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"Kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"amount","type":"uint256"}],"name":"getMaxAmountToBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"setMaxAmountToBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getGameCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_msg","type":"string"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"winner","type":"bool"}],"name":"Status","type":"event"}]);

var CoinFlip = CoinFlipContract.at(contractAddress);
	  
var CoinFlipEvent = CoinFlip.Status();

UpdateGamesTable();

UpdateContractInfo();


function UpdateContractInfo() {
	
  web3.eth.getBalance(contractAddress, function(error, result) {
    if (!error) {
  	console.log('Contract Address: ' + contractAddress);
      console.log('Contract Balance: ' + result / 1000000000000000000 + ' ethers');
  	
  	  $('#contractInfo').html('Contract Address: <a href="https://rinkeby.etherscan.io/address/' + contractAddress + '" target="_blank">' + contractAddress + '</a> / Contract Balance: ' + result / 1000000000000000000 + ' ethers / Total Bets: ' + totalGameCount)
  	
    } else {
  	  console.log('Error getting Contract Balance: ' + error);
    }
  });
}

function UpdateGamesTable() {
	
  $('#lastPlayedGamesTable tbody').html('');

  CoinFlip.getGameCount(function(error, result) {
	if(!error) {
      //console.log(result);
	  totalGameCount = result;
      gameCount = result;
      var html = '';
      
	  counter = 1;
      for (gameCount--; gameCount >= 0 ; gameCount--) {
        if (lastPlayedGamesLimit < counter) { break; }
				
        //console.log("-> gameCount: " + gameCount);
				
        CoinFlip.getGameEntry(gameCount, function(error, result) {
          
		  if (!error) {
            //console.log(result);
            gameItem = result;
            etherBet = gameItem[3] / 1000000000000000000;
            etherPrize = gameItem[4] / 1000000000000000000;
            //console.log("-> Address: " + gameItem[0] + " Blocknumber: " + gameItem[1] + " BlockTimestamp: " + gameItem[2] + " Bet: " + etherBet + " Prize: " + etherPrize + " Winner: " + gameItem[5] );
						
            if (gameItem[5] == true) {
              trClass = "win";
              WinnerTrContent = "<i class=\"fa fa-thumbs-o-up\" aria-hidden=\"true\"></i>";
            } else {
              trClass = "loose";
              WinnerTrContent = "<i class=\"fa fa-thumbs-o-down\" aria-hidden=\"true\"></i>";
            }
						
            html = "<tr class=\"" + trClass + "\"><td>" + gameItem[0] + "</td><td>" + gameItem[1] + "</td><td>" + gameItem[2] + "</td><td>" + etherBet + "</td><td>" + etherPrize + "</td><td>" + WinnerTrContent + "</td></tr>";
						
            $('#lastPlayedGamesTable tbody').append(html);
			
          } else {
            console.log(error);
          }
        });
		counter++;
      }
    } else {
      console.error(error);
	}
  });

  //console.log("Played Games: " + gameCount);
}


CoinFlipEvent.watch(function(error, result) {
  if (!error) {
	
	if (processedBlocks.lastIndexOf(result.blockNumber) != -1) return;
    
	UpdateGamesTable();
	
	UpdateContractInfo();
	
	$("#loader").hide();
	
    if (result.args.winner) {
      $("#alert").removeClass( "alert-danger" ).addClass( "alert-success" );
	  var Sound = new Audio(winSound);
    } else {
      $("#alert").removeClass( "alert-success" ).addClass( "alert-danger" );
	  var Sound = new Audio(loseSound);
	}
    
    $("#alertText").html(result.args._msg);

    console.log('Success getting Status Event!');
    console.log(result);
	
	processedBlocks.push(result.blockNumber);
    
    $("#alert").show();	
	
	if (AudioOn) {
		Sound.play();
	}
	
	$("#submit").prop('disabled', false); 
    
  } else {
    $("#loader").hide();
	
	console.log('Ooops! Something goes wrong getting Status Event...');
    console.log(err);
  }
});


$("#submit").click(function() {
  
  $("#alert").hide();
  
  if ($("#amount").val() <= 0)  {
	  
	$("#alert").removeClass( "alert-success" ).addClass( "alert-danger" );
	$("#alertText").html('Sorry, minumum amount to bet is 0,001 ether!');
	$("#alert").show();
	$("#amount").val('0.001');
	return;  
  }

  //console.log(jQuery.isEmptyObject(web3.eth.accounts[0]));
  if (jQuery.isEmptyObject(web3.eth.accounts[0])) {
	  
	$("#alert").removeClass( "alert-success" ).addClass( "alert-danger" );
	$("#alertText").html('Please unlock your Metamask account and reload the page to play the game!');
	$("#alert").show();
	console.log('Please unlock your Metamask account and reload the page to play the game!');
	return;  
  }
  
  $("#loader").show();
  $("#submit").prop('disabled', true); 
  
  amount = $("#amount").val() * 1000000000000000000;
  //console.log("Amount in WEIs:");
  //console.log(amount);
  
  CoinFlip.Play({from: web3.eth.accounts[0], gas: 3000000, value: amount}, (err, res) => {
    if (!err) {

    } else {
      $("#loader").hide();
	  
	  $("#alert").removeClass( "alert-success" ).addClass( "alert-danger" );
	  $("#alertText").html('' + err);
	  $("#alert").show();
	  
	  console.log('Something goes wrong!');
      console.log(err);		
		
	}
  });
  
});


function soundOnOff() {
	if (AudioOn) {
		AudioOn = false;
		$('#soundSwitch').html('<i class="fa fa-2x fa-volume-off soundSwitch" aria-hidden="true"></i>');
		console.log('Sound is Off');
	} else {
		AudioOn = true;
		$('#soundSwitch').html('<i class="fa fa-2x fa-volume-up soundSwitch" aria-hidden="true"></i>');
		console.log('Sound is On');
	}
	
}
