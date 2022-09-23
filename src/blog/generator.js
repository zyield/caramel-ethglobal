// gets array of posts
// generates html

export const generate = ({ hashes, ens }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval'">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css"
      integrity="sha512-xiunq9hpKsIcz42zt0o2vCo34xV0j6Ny8hgEylN3XBglZDtTZ2nwnqF/Z/TTCc18sGdvCjbFInNd++6q3J0N6g=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.1/ethers.umd.min.js"></script>

    <meta charset="utf-8" />
    <meta
      name="description"
      content="My forever blog"
    />
    <title>Crml blog</title>
    <style>
      .toggle-content {
      	display: none;
      }

      .toggle-content.is-visible {
      	display: inline;
      }

      body {
        background-color: rgba(229, 231, 235, .2);
      }

      body > div {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 2%;
        left: 2%;
        background-color: #fff;
        border: 1px solid rgb(229, 231, 235);
        overflow-y: scroll;
      }

      header {
        text-align: center;
      }

      header,
      section {
        max-width: 60%;
        margin: 5% auto;
      }

      section {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      section h1 {
        color: #444;
      }

      article {
        margin-top: 3%;
        max-width: 800px;
        width: 100%;
        border-bottom: 1px solid rgb(244, 244, 245);
      }

      #connectButtonContainer {
          position: absolute;
          top: 20px;
          right: 20px;
      }

      #connectButton {
          margin-bottom: 16px;
          color: #fff;
      }

      #connectButton img {
          width: 36px;
          margin-right: 16px;
      }

      #walletID span{
          max-width: 90%;
          margin: 0 auto;
          font-size: 12px;
          font-weight: 600;
      }

      #walletID {
          font-size: 12px;
          font-weight: 600;
          float: left;
          margin-left: 20px;
          margin-top: 10px;
      }

      #mobileDeviceWarning {
          display: none;
          margin-top: 24px;
          color: rgb(247, 47, 47);
      }

      #mobileDeviceWarning.show {
          display: block;
      }

      .alert {
          z-index: 10;
          position: fixed;
          left: 0;
          top: 0;
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100vh;
          background: #ffffff;
      }

      .alert.show {
          display: flex;
      }

      .alert .button {
          margin-top: 24px;
      }

      /* Loading dots styles */
      @keyframes opacity {
      	0% { opacity: 1; }
      	100% { opacity: 0; }
      }

      .loadingButton {
          pointer-events: none;
      }

      .loadingButton #loading {
          display: flex;
      }

      #loading {
      	position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: none;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 99px;
      }

      #loading span:not(:last-child) {
      	margin-right: 5px;
      }

      #loading span {
      	animation-name: opacity;
      	animation-duration: 1s;
      	animation-iteration-count: infinite;
      }

      #loading span:nth-child(2) {
      	animation-delay: 100ms;
      	animation-delay: 100ms;
      }

      #loading span:nth-child(3) {
      	animation-delay: 300ms;
      	animation-delay: 300ms;
      }

      #connectContainer {
        margin-top: 20px;
        text-align: right;
      }

    </style>
  </head>
  <body>
    <div>
      <div class="container" id="connectContainer">
        <div class="row">
          <div class="column">
            <button id="connectButton" class="toggle-content">
              Subscribe with EPNS
              <span id="loading"><span>&bull;</span><span>&bull;</span><span>&bull;</span></span>
            </button>
            <button id="optOutButton" class="toggle-content">
              Opt-out
            </button>
            <div id="walletID"></div>
          </div>

        </div>
      </div>

      <header>
        <h1>${ens}</h1>
      </header>
      <main>
        <section id="blog">
        </section>
      </main>
    </div>
  </body>

  <script>
// Show an element
var show = function (elem) {
	elem.classList.add('is-visible');
};

// Hide an element
var hide = function (elem) {
	elem.classList.remove('is-visible');
};

// Toggle element visibility
var toggle = function (elem) {
	elem.classList.toggle('is-visible');
};

const connectButton = document.getElementById("connectButton");
const optOutButton = document.getElementById("optOutButton");
const walletID = document.getElementById("walletID");
const reloadButton = document.getElementById("reloadButton");
const installAlert = document.getElementById("installAlert");
const mobileDeviceWarning = document.getElementById("mobileDeviceWarning");

show(connectButton)
hide(optOutButton)

const addresses = (chainId) => {
  if (chainId === 1) {
    return {
      channelAddress: "0xBA840BBa552cAf4A4EC61E78DcdB00194CF7A9a0",
      contractAddress: "0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa",
      subdomain: "backend",
    }
  } else if (chainId === 42) {
    return {
      channelAddress: "0xBA840BBa552cAf4A4EC61E78DcdB00194CF7A9a0",
      contractAddress: "0x87da9Af1899ad477C67FeA31ce89c1d2435c77DC",
      subdomain: "backend-staging"
    }
  }
}

const startLoading = () => {
  connectButton.classList.add("loadingButton");
};

const stopLoading = () => {
  const timeout = setTimeout(() => {
    connectButton.classList.remove("loadingButton");
    clearTimeout(timeout);
  }, 300);
};

function getSubscriptionMessage(channel, userAddress, action) {
  const actionTypeKey = (action === "Unsubscribe") ? "unsubscriber" : "subscriber";

  return {
    channel,
    [actionTypeKey]: userAddress,
    action: action,
  };
}

function getTypeInformation(action) {
  if (action === "Subscribe") {
    return {
      Subscribe: [
        { name: "channel", type: "address" },
        { name: "subscriber", type: "address" },
        { name: "action", type: "string" },
      ],
    };
  }

  return {
    Unsubscribe: [
      { name: "channel", type: "address" },
      { name: "unsubscriber", type: "address" },
      { name: "action", type: "string" },
    ],
  };
};

function getDomainInformation(chainId, verifyingContract) {
  return {
    name: "EPNS COMM V1",
    chainId,
    verifyingContract,
  };
}

function unSubscribe(address, chainId) {

  let { channelAddress, contractAddress, subdomain } = addresses(chainId);

  const channelAddressEIP = "eip155:" + chainId+ ":"+ channelAddress;
  const userAddressEIP = "eip155:" + chainId + ":" + address;

  const domainInformation = getDomainInformation(chainId, contractAddress);
  const typeInformation = getTypeInformation("Unsubscribe");
  const messageInformation = getSubscriptionMessage(channelAddress, address, "Unsubscribe")

  let url = "https://" + subdomain ".epns.io/apis/v1/channels/eip155:" + chainId + ":" + channelAddress + "/unsubscribe"

  const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()

  signer._signTypedData(
    domainInformation,
    typeInformation,
    messageInformation
      ).then((signature) => {
      const verificationProof = signature;
      const body = {
        verificationProof,
        message: {
          ...messageInformation,
          channel: channelAddressEIP,
          unsubscriber: userAddressEIP
        },
      };

      fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
       })
       .then((res) => {
        if (res.status === 204) {
              hide(optOutButton)
              show(connectButton)
        }
       })
  })
}


function subscribe(address, chainId) {
  let { channelAddress, contractAddress, subdomain } = addresses(chainId)

  const channelAddressEIP = "eip155:" + chainId+ ":"+ channelAddress;
  const userAddressEIP = "eip155:" + chainId + ":" + address;

  const domainInformation = getDomainInformation(chainId, contractAddress);
  const typeInformation = getTypeInformation("Subscribe");
  const messageInformation = getSubscriptionMessage(channelAddress, address, "Subscribe")

  let url = "https://" + subdomain ".epns.io/apis/v1/channels/eip155:" + chainId + ":" + channelAddress + "/subscribe"

  const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()

  signer._signTypedData(
    domainInformation,
    typeInformation,
    messageInformation
      ).then((signature) => {
      const verificationProof = signature;
      const body = {
        verificationProof,
        message: {
          ...messageInformation,
          channel: channelAddressEIP,
          subscriber: userAddressEIP
        },
      };

      fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
       })
       .then((res) => {
        if (res.status === 204) {
              show(optOutButton)
              hide(connectButton)
        }
       })
  })
}

let opts = {
  'omitExtraWLInCodeBlocks': true,
  'noHeaderId': false,
  'parseImgDimensions': true,
  'simplifiedAutoLink': true,
  'literalMidWordUnderscores': true,
  'strikethrough': true,
  'tables': true,
  'tablesHeaderId': false,
  'ghCodeBlocks': true,
  'tasklists': true,
  'smoothLivePreview': true,
  'prefixHeaderId': false,
  'disableForced4SpacesIndentedSublists': false,
  'ghCompatibleHeaderId': true,
  'smartIndentationFix': false
}

const converter = new showdown.Converter(opts)

let hashes = ${JSON.stringify(hashes)}

Promise.all(hashes.map(hash =>
  fetch('https://caramel.infura-ipfs.io/ipfs/' + hash)
  .then(res => res.text())
))
.then(posts =>
  posts.map(markdown => converter.makeHtml(markdown))
)
.then(posts => {
  let main = document.querySelector('#blog')
  posts.forEach(p => {
    let article = document.createElement('article')
    article.innerHTML = p
    main.appendChild(article)
  })
})

function checkIfSubscribed(address, chainId, callback) {
  let { channelAddress, subdomain } = addresses(chainId)

  // check if subscribed
  fetch("https://" + subdomain + ".epns.io/apis/channels/_search"}, {
        method: "POST",
        headers: {
              'Content-Type': 'application/json'
            },
        body: JSON.stringify(
              {"query":"Caramel","op":"read","page":1,"address": address,"pageSize":1000,"chainId":chainId}
            )
      })
    .then((res) => res.json())
    .then(({ channels }) => {
          channels.map((channel) => {
            if (channel.channel === channelAddress) {
              callback(channel, addresses)
            }
          })
        })
}

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

if (signer) {
      signer.getAddress().then((address) => {
            provider.getNetwork().then((network) => {
                  let { chainId, name } = network

                if (address && name) {
                      walletID.innerHTML = "" + address + "( " + name + " )"
                }

                checkIfSubscribed(address, chainId, function(channel, addresses) {
                      if (channel.isSubscriber) {
                            hide(connectButton)
                            show(optOutButton)
                      }
                    })
                })
          })
    }


optOutButton.addEventListener("click", () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  provider.getNetwork().then((network) => {
    let { chainId } = network

    signer.getAddress().then((address) => {
      unSubscribe(address, chainId);
    })

  })
})

connectButton.addEventListener("click", () => {
  if (typeof window.ethereum !== "undefined") {
    startLoading();

    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        const account = accounts[0];

        provider.getNetwork().then((network) => {
          let { chainId, name } = network

          checkIfSubscribed(account, chainId, function(channel) {
            if (channel.isSubscriber) {
              hide(connectButton)
              show(optOutButton)
            } else {
              subscribe(account, chainId);
            }
          })
        })

        stopLoading();
      })
      .catch((error) => {
            console.log(error, error.code);

            alert(error.code);
            stopLoading();
      });
  } else {
    window.open("https://metamask.io/download/", "_blank");
    installAlert.classList.add("show");
  }
});


  </script>
</html>
`
