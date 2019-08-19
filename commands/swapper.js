const axios = require('axios');
const queryString = require('query-string');



const secPrompt = (url, sec, id, stuff) => {
  axios.get(`${url}security_prompt.php?rg_sess_id=${stuff.session}&suid=${id}&serverid=${stuff.serverid}`)
    .then(res => {
      const page = res.data;
      const value = page.split('prompt_number')[1].split('value=')[1].split('"')[1];
      console.log(res);
      axios.post(`${url}security_prompt.php?rg_sess_id=${stuff.session}&suid=${id}&serverid=${stuff.serverid}`, {
        data: {
          prompt_number: value,
          answer: sec,
          security_submitted: 'Continue'
      },
        maxRedirects:0,
        headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0.1 ID:20120614114901',
        Cookie: 'security_return_page=/treasury.php; '
        }
      })
        .then(res => {
          const page = res.data
          //console.log(res)//page);
          //cb();
        })
        .catch(o_O => {
          console.log('j')//o_O);
          return stuff.message.reply('Error. Please check logs.');
        })
    }) 
    .catch(o_O => {
      console.log('i')//o_O);
      return stuff.message.reply('Error. Please check logs.');
    })
}

exports.swapper = (url, sec, id, stuff) => {
  axios.get(`${url}itemtransfer.php?suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${stuff.session}`)
    .then(res => {
      const page = res.data.toLowerCase().split('divitems');
      let items = [];
      page.map(section => {
        if (section.indexOf('quest items') !== -1 || section.indexOf('orbs') !== -1 || section.indexOf('augments') !== -1) {
          const sectionItems = section.split('divitem');
          sectionItems.map(item => {
            let src = item.split('src=')[1]
            src ? src = src.split('.')[0] : null
            if (src && src.indexOf('images') !== -1) {
              src = src.split('/');
              if (stuff.items.indexOf(src[src.length-1]) !== -1) {
                const itemId = item.split('event,')[1].split(',')[0]
                console.log(itemId);
              }
            };
          })
         // && section.indexOf('<h1>other') === -1
        } 
      })
    })
}

exports.sendItem = (url, sec, id, stuff) => {
  axios.post(`${url}itemtransfer.php?suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${stuff.session}`, {
    data: {
      self: stuff.sendToId,
      submit: 'Send items!',
      security_submitted: 'Continue'
  },
    maxRedirects:0,
    headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0.1 ID:20120614114901',
    Cookie: 'security_return_page=/treasury.php; '
    }
  })

}