// gets array of posts
// generates html

export const generate = hashes => `
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

    <meta charset="utf-8" />
    <meta
      name="description"
      content="My forever blog"
    />
    <title>My forever blog</title>
    <style>
      section {
        max-width: 60%;
        margin: 5% auto;
      }
    </style>
  </head>
  <body>
    <main>
      <section id="blog">
      </section>
    </main>
  </body>

  <script>
    const converter = new showdown.Converter()

    let hashes = ${JSON.stringify(hashes)}

    Promise.all(hashes.map(hash =>
      fetch('https://gateway.pinata.cloud/ipfs/' + hash)
      .then(res => res.text())
    ))
    .then(posts => posts.map(markdown => converter.makeHtml(markdown)))
    .then(posts => document.querySelector('#blog').innerHTML = posts.join(''))

  </script>
</html>
`
