import React from "react";
import { useQuery } from "@apollo/react-hooks";
import QRCode from "qrcode.react";
import gql from "graphql-tag";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function GenQR({ pcId }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { data, loading, error } = useQuery(FETCH_PC_QUERY, {
    variables: {
      pcId,
    },
  });
  const downloadQR = () => {
    const canvas = document.getElementById(data.getPc.id);
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = data.getPc.name + ".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  if (loading) return <p>loading ...</p>;
  if (error) return <p>error</p>;

  return (
    <Box display="inline">
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open QR Code
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"QR Code"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <QRCode
              size={512}
              value={data.getPc.id}
              level="H"
              id={data.getPc.id}
            />
          </DialogContentText>
          <Box display="flex" justifyContent="center">
            <Box p={1}>
              <Button onClick={downloadQR} color="primary">
                Download
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
const FETCH_PC_QUERY = gql`
  query($pcId: ID!) {
    getPc(pcId: $pcId) {
      id
      name
      sertag
      assettag
      vlan
      ip
      createdAt
      posiId
    }
  }
`;

export default GenQR;
