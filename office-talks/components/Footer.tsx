import {
    Typography,
    Box,
} from "@mui/material";
const Footer = () => {
    return (
        <Box
            sx={{
                p: 2,
                textAlign: "center",
                background: "#fff",
                borderTop: "1px solid #e5e7eb",
            }}
        >
            <Typography variant="body2" color="text.secondary">
                © 2026 OfficeTalks. All rights reserved.
            </Typography>
        </Box>
    )
}

export default Footer;