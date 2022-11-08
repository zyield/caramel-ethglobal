// gets array of posts
// generates html

export const generate = ({ ens, arweaveWalletAddress, encryptedWalletCID }) => `
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
    <title>${ens || 'Crml'} - Home</title>
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
      #encryptedWalletCID {
        display: none;
      }
    </style>
  </head>
  <body>
    <div>
      <header>
        <h1>${ens}</h1>
      </header>
      <main>
        <section id="blog">
        </section>
      </main>
    </div>
    <span id="encryptedWalletCID">${encryptedWalletCID}</span>
  </body>

  <script>
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

    const query = \`
      query getTransactions (
          $owners: [String!]
          $tags: [TagFilter!]
      ) {
          transactions (
              owners: $owners
              tags: $tags
          ) {
              edges {
                  node {
                      id
                      tags {
                          name
                          value
                      }
                      data {
                          size
                          type
                      }
                  }
              }
          }
      }
    \`

    const tombstoneOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        query: query,
        variables: {
    	    "owners": ["${arweaveWalletAddress}"],
    	    "tags": [{"name": "Tombstone", "values": ["true"]}]
        }
      })
    };

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        query: query,
        variables: {
    	    "owners": ["${arweaveWalletAddress}"],
    	    "tags": [{"name": "App-Name", "values": ["Caramel"]}, {"name": "Content-Type", "values": ["text/plain"]}]
        }
      })
    };

    fetch('https://arweave.net/graphql', tombstoneOptions)
      .then(response => response.json())
      .then(({ data: { transactions: { edges } } }) => {
        let tombstones = edges.map(transaction => transaction.node.tags.find(tag => tag.name == "Id"))
        let tombstoneIds = tombstones.map(ts => ts.value)

        fetch('https://arweave.net/graphql', options)
          .then(response => response.json())
          .then(({ data: { transactions: { edges } } }) => edges.filter(edge => !tombstoneIds.includes(edge.node.id)))
          .then((edges) => {
            Promise.all(edges.map(transaction => {
              return fetch("https://bnjr5drbo27dam2cmqdbijmmof7mnxlydfjoywtwbdofa3uzol7q.arweave.net/" + transaction.node.id)
                .then(res => res.text())
              }
            ))
              .then(posts => {
                return posts.map(markdown => converter.makeHtml(markdown))
              })
            .then(posts => {
              let main = document.querySelector('#blog')
              posts.forEach(p => {
                let article = document.createElement('article')
                article.innerHTML = p
                main.appendChild(article)
              })
            })
            .catch(err => console.error(err));
        })
     })
  </script>
</html>
`
