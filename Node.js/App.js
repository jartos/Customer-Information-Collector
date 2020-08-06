import React, { useState, useEffect } from 'react';

const RestApp = () => {

  const [sivu, setSivu] = useState("");     // 1: pääsivu | 2: lisää asiakas | 3: Muuta tiedot
  const [types, setTypes] = useState([]);

  const [avain, setAvain] = useState('');
  const [nimi, setNimi] = useState('');
  const [osoite, setOsoite] = useState('');
  const [postinro, setPostinro] = useState('');
  const [postitmp, setPostitmp] = useState('');
  const [luontipvm, setLuontipvm] = useState('');
  const [asty_avain, setAsty_avain] = useState('');
  const [alkupmuutospvm, setAlkupmuutospvm] = useState('');


 
  useEffect(() => {                       // Ladataan asiakkaat taulukkoon kun sovellus käynnistyy

    async function fetchTypes() {
      let response = await fetch("http://localhost:3000/asiakas?");
      let d = await response.json();
      
      setTypes(d.response);
    }

    if (types == "")
      fetchTypes();

  }, [sivu]);




  async function deleteAsiakas(props) {

    if (
      window.confirm("Poista asiakas " + props.NIMI + "?")) {

      const avain = { "avain": props.AVAIN }

      const optionsDelete = {

        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(avain)
      }

      let responseDelete = await fetch("http://localhost:3000/asiakas/:avain", optionsDelete).then(responseDelete => {
        console.log(responseDelete)
        console.log(avain)
        console.log("response2:", JSON.stringify(responseDelete.status))

        setSivu(1);
      })
    }
  }



  const styleObj = {
    padding: 5,
    border: "1px solid black",
    textAlign: "center",
    backgroudColor: ""
  }

  const KaikkiAsiakkaat = () => {

    const a = types.map((a) => <tr key={a.AVAIN}>
      <td >{a.AVAIN}</td>
      <td >{a.NIMI}</td>
      <td >{a.OSOITE}</td>
      <td >{a.POSTINRO}</td>
      <td >{a.POSTITMP}</td>
      <td >{a.LUONTIPVM}</td>
      <td >{a.ASTY_AVAIN}</td>
      <td >{a.SELITE}</td>
      <td >{a.MUUTETTUMUUTOSPVM}</td>
      <td>
        <button onClick={() => vaihdaMuutaSivu(a)}>Muuta</button>
      </td>
      <td>
        <button onClick={() => deleteAsiakas(a)}>Poista</button>
      </td>
    </tr>
    )

    const divider = {

      padding: 30,
      height: "auto",
      display: "inlineBlock"
    }

    return <div>
      <table>
        <thead>
          <tr>
            <th style={styleObj}>AVAIN</th>
            <th style={styleObj}>NIMI</th>
            <th style={styleObj}>OSOITE</th>
            <th style={styleObj}>POSTINRO</th>
            <th style={styleObj}>POSTITMP</th>
            <th style={styleObj}>LUONTIPVM</th>
            <th style={styleObj}>ASTY</th>
            <th style={styleObj}>SELITE</th>
            <th style={styleObj}>MUUTOSPVM</th>
          </tr>
        </thead>
        <tbody>
          {a}
        </tbody>
      </table>
      <br></br>
      <button onClick={() => setSivu(2)}>Lisää asiakas</button>
      <div style={divider}></div>
      Lähetä virhekoodi serverille: <input type="checkbox" onChange={e => lisaaVirhekoodi(e)}></input>

    </div>
  };


  async function lisaaVirhekoodi(props) {

    if (props.target.checked) {


      let response = await fetch("http://localhost:3000/asiakas?nimi=99999");
      let d = await response.json();
      console.log("Virheilmoitus: ", d);
    }
  }



  function LisaaTiedotSivu() {

    const [nimi1, setNimi] = useState('');
    const [osoite1, setOsoite] = useState('');
    const [postinumero1, setPostinumero] = useState('');
    const [postitmp1, setPostitmp] = useState('');
    const [luontipvm1, setLuontipvm] = useState('');
    const [asiakastunnus1, setAsiakastunnus] = useState('');

    let ts = new Date();

    let year = ts.getFullYear();
    let month = (ts.getMonth() + 1);
    let date = (ts.getDate());

    let pvm = year + "-" + month + "-" + date

    let addCustomer = {

      "NIMI": nimi1,
      "OSOITE": osoite1,
      "POSTINRO": postinumero1,
      "POSTITMP": postitmp1,
      "LUONTIPVM": pvm,
      "ASTY_AVAIN": asiakastunnus1
    }

    return <div>

      <div>
        <p>Lisää asiakas</p>

        <form onSubmit={onFormSubmit}>

          Nimi<input type="text" onChange={e => setNimi(e.target.value)} /><br></br>
          Osoite<input type="text" onChange={e => setOsoite(e.target.value)} /><br></br>
          Postinro (esim. 07100)<input type="text" onChange={e => setPostinumero(e.target.value)} /><br></br>
          Postitmp<input type="text" onChange={e => setPostitmp(e.target.value)} /><br></br>
          Luontipvm (YYYY-MM-DD)<input type="text" value={pvm} onChange={e => setLuontipvm(e.target.value)} /><br></br>
          Asiakastunnus (1-4)<input type="text" onChange={e => setAsiakastunnus(e.target.value)} /><br></br>
          <button type="submit" onClick={() => lisaaAsiakas({ addCustomer })}>Tallenna</button>
          <button onClick={() => setSivu(1)}>Peruuta</button>

        </form>
      </div>
    </div>
  };



  const vaihdaMuutaSivu = (props) => {

    setAvain(props.AVAIN);
    setNimi(props.NIMI);
    setOsoite(props.OSOITE);
    setPostinro(props.POSTINRO);
    setPostitmp(props.POSTITMP);
    setLuontipvm(props.LUONTIPVM);
    setAsty_avain(props.ASTY_AVAIN);
    setAlkupmuutospvm(props.MUUTOSPVM);

    setSivu(3);
  }

  const MuutaTiedotSivu = () => {

    const [nimi2, setNimi2] = useState(nimi);
    const [osoite2, setOsoite2] = useState(osoite);
    const [postinro2, setPostinro2] = useState(postinro);
    const [postitmp2, setPostitmp2] = useState(postitmp);
    const [luontipvm2, setLuontipvm2] = useState(luontipvm);
    const [asty_avain2, setAsty_avain2] = useState(asty_avain);

    console.log("mpv:  ", alkupmuutospvm);

    let ts = new Date();

    let year = ts.getFullYear();
    let month = (ts.getMonth() + 1);
    let date = (ts.getDate());

    let hours = ts.getHours();
    let minutes = ts.getMinutes();
    let seconds = ts.getSeconds();

    let timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    return <div>

      <div>
        <h4>Muuta asiakkaan {nimi} tietoja </h4>

        <form>

          Nimi<input type="text" defaultValue={nimi} onChange={e => setNimi2(e.target.value)} /><br></br>
          Osoite<input type="text" defaultValue={osoite} onChange={e => setOsoite2(e.target.value)} /><br></br>
          Postinro (esim. 07100)<input type="text" defaultValue={postinro} onChange={e => setPostinro2(e.target.value)} /><br></br>
          Postitmp<input type="text" defaultValue={postitmp} onChange={e => setPostitmp2(e.target.value)} /><br></br>
          Luontipvm (YYYY-MM-DD)<input type="text" defaultValue={luontipvm} onChange={e => setLuontipvm2(e.target.value)} /><br></br>
          Asiakastunnus (1-4)<input type="text" defaultValue={asty_avain} onChange={e => setAsty_avain2(e.target.value)} /><br></br>
          <button type="submit" onClick={() => { setNimi(nimi2); updateAsiakas() }}>Save</button>
          <button onClick={() => setSivu(1)}>Peruuta</button>

        </form>
      </div>
    </div>

    async function updateAsiakas() {



      let response = await fetch("http://localhost:3000/asiakas?avain=" + avain);
      let d = await response.json();

      console.log("d: ", d);

      if (d.response[0].MUUTOSPVM == alkupmuutospvm) {


        const avain2 = {

          "avain": avain,
          "NIMI": nimi2,
          "OSOITE": osoite2,
          "POSTINRO": postinro2,
          "POSTITMP": postitmp2,
          "LUONTIPVM": luontipvm2,
          "ASTY_AVAIN": asty_avain2,
          "MUUTOSPVM": timestamp,
          "ALKUPMUUTOSPVM": alkupmuutospvm
        }

        const optionsUpdate = {

          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(avain2)
        }

        let responseUpdate = await fetch("http://localhost:3000/asiakas/:avain", optionsUpdate).then(responseUpdate => {
          console.log(responseUpdate)
          //console.log(avain2)
          console.log("response2:", JSON.stringify(responseUpdate.status))

        })
      }
    }
  };


  const onFormSubmit = () => {

  }

  async function lisaaAsiakas(addCustomer) {

    console.log("putData: ", addCustomer.addCustomer)

    const optionsLisaa = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(addCustomer.addCustomer)
    }

    let responseLisaa = await fetch("http://localhost:3000/asiakas", optionsLisaa).then(responseLisaa => {
      console.log(responseLisaa)
    })
  }



  function NaytaSivu() {

    if (sivu === 1) {
      return <KaikkiAsiakkaat />
    }
    if (sivu === 2) {
      return <LisaaTiedotSivu />
    }
    if (sivu === 3) {
      return <MuutaTiedotSivu />
    }
    else
      return <KaikkiAsiakkaat />
  };

  return (
    <div>

      <NaytaSivu />

    </div>
  );
}

export default RestApp;
