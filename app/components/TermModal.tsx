import { Box, Modal, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';

interface TermModalProps {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    userId: number | null
}



export default function TermModal({ openModal, setOpenModal, userId }: TermModalProps) {
    async function handleLastTermAccept() {

        const ultimoTermo = JSON.parse(localStorage.getItem("terms") || "[]")[0];

        const response = await axios.post(`http://localhost:3000/terms/acc/${userId}`, {
            id_user: userId,
            id_term: ultimoTermo.version
        })

        console.log(response)
    }
    const redirectLogin = () => {
        document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/login';
    };
    return (
        <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className='modalBox'>
                <Typography id="modal-modal-title" variant="h4" component="h2">
                    Termo de consentimento
                </Typography>
                <Typography id="modal-modal-description" sx={{ my: 4 }}>
                    {JSON.parse(localStorage.getItem("terms") || "[]")[0].texto}
                </Typography>
                <button onClick={handleLastTermAccept}>Eu concordo</button>
                <button className='cancelButton' onClick={redirectLogin}>Não concordo</button>
            </Box>
        </Modal>
    )
}