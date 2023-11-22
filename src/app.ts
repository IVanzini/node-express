import express, { NextFunction, Request, Response } from "express";

const port = 3000;
const app = express();

app.set("views", "./src/views");
app.set("view engine", "hbs");

// middlewares
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("log:", req.method, req.url, Date.now());
    // req.body = "Body inserito dal middleware di log"; modifico req e/o resp e le modifiche me le ritrovo nei middleware seguenti
    // res.setHeader("", "LAB4T Express");
    next();
});

app.use(express.json()); // fa il parse in json delle request con header content-type application/json

app.use("/pluto", (req: Request, res: Response, next: NextFunction) => {
    console.log("log speciale pluto");
    next();
});

app.use("assets", express.static("public")); // per le rotte che cominciano con /assets vado a vedere se trovo una corrispondenza nella cartella public

app.use(express.static("public")); // qui viene intercettata qualsiasi richiesta, es root del sito/pippo.html

app.get("/", (req: Request, res: Response) => {
    // console.log(req.body);
    res.render("index", { pageTitle : "Home Page" });
});

app.get("/contatti", (req: Request, res: Response) => {
    res.render("contatti", { pageTitle : "Contatti" });
});

app.get("/sedi", (req: Request, res: Response) => {
    res.render("sedi", { pageTitle : "Sedi" });
});

app.get("/mario", (req: Request, res: Response) => {
    const mario = {
        nome: "Mario",
        cognome: "Verdi",
        eta: 45
    };
    res.json(mario);
});

app.get("/films/popolari", (req: Request, res: Response) => { 
    const idFilm  = req.params["id"]; 
    res.status(200).send("Hai richiesto l'elenco dei films POPOLARI"); // 200 è lo status di default
});

app.post("/films/nuovo", (req: Request, res: Response) => { 
    const idFilm  = req.params["id"]; 
    res.send("Pensavi di inserire un film sul db e invece torno questa stringa"); 
});

app.get("/films/:id", (req: Request, res: Response) => { 
    const idFilm  = req.params["id"]; 
    const idFilmNumber = Number(idFilm); 

    if (isNaN(idFilmNumber)) {
        res.status(400).send("Errore nella conversione dell'id in numero");
        return;
    }

    res.send("Hai richiesto il film con id: " + idFilm);
});

app.get("/errore", (req: Request, res: Response) => { // simulazione di errore per dare error 500
    throw new Error("errore simulato");
});

app.get("/errore-gestito", (req: Request, res: Response) => { 
    try {
        throw new Error("errore simulato nel try-catch");
    } catch (error) {
        res.status(500).send("Errore del server nella rotta /errore-gestito");
    } 
});

app.post("/register", (req: Request, res: Response) => { 
    //console.log(req.body);
    const password = req.body.password as string;
    
    if (password.length > 4) {
        res.json({ id:  1, email: req.body.email, username: req.body.username });
    } else {
        res.status(400).send("Password too short");
    }
    
});

app.use((req: Request, res: Response) => {
    res.status(404).send("Pagina non trovata"); // qui specifico 404
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);  
    res.status(500).send("Errore del server."); 
});

app.listen(port, () => {
    console.log(`Server in esecuzione su http://localhost:${port}`);
});