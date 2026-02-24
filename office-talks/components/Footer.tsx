"use client";

import {
  Typography,
  Box,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Footer = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 2 },
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >

        {/* Left */}
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign={isMobile ? "center" : "left"}
        >
          © 2026 OfficeTalks. All rights reserved.
        </Typography>

        {/* Right */}
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign={isMobile ? "center" : "right"}
        >
          Version 1.0.0
        </Typography>

      </Stack>
    </Box>
  );
};

export default Footer;