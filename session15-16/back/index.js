import express from 'express';
import bodyParser from 'body-parser';
import webpush from 'web-push';


const publicVKey = "BGNpZuF8IDFzK-E24HbhtMPiqXGq9mqNHhmIXvQwjI-lPeyeqK_V1tiIxSBOmSydspJFdQIYF2vOXnjd5juRj_o";
const privateVKey = "YXfZ6FVnjOsi9Be_eMGE0_0VljdbwGc2VsYWyP0QXSQ";

webpush.setVapidDetails('mailto:julien.sosthene@ynov.com',publicVKey,privateVKey);


const app = express();
const port = 8080; // default port to listen

const subDB = [];

const getRandom = (array) => {
	return array[Math.floor(Math.random() * array.length)];
}

// Serve all files in client
app.use(express.static('../front'));
app.use(bodyParser.json());

app.post('/subscription', async (req,res) => {
    console.log(req.body);
    subDB.push(req.body);
    res.status(200).json({ status : "OK" });
});
app.get('/send-notification/:id', async (req, res) => {
	const id = parseInt(req.params.id);
    console.log(`Sending notification to client ${id}`);
    if( id === NaN || id < 0 || id >= subDB.length){
		res.status(400).json({status : "BAD_REQUEST", message : "Id was invalid"});
		return;
	}
    await webpush.sendNotification(subDB[id],JSON.stringify({ woof : getRandom(["Woof!","Woof woof!", "Bark bark bark!", "Awooooo"])}));
    res.status(200).json({ status : "OK" });
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});