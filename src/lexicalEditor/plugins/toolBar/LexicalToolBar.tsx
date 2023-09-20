import { Grid } from "@mui/material";
import iconsList from "./iconsList";
import useOnClickListener from "./useOnClickListener";

export const LexicalToolBar = () => {
  const { onClick, selectedEventTypes, blockType } = useOnClickListener();

  type Plugin = {
    id: number;
    Icon: any & {
      muiName: string;
    };
    event: string;
  }

  const isIconSelected = (plugin: Plugin) => {
    return (selectedEventTypes.includes(plugin.event) ||
      blockType.includes(plugin.event))
  }

  return (
    <Grid
      container
      justifyContent="space-between"
      spacing={2}
      alignItems="center"
      sx={{
        background: "white",
        borderRadius: 1,
        pb: 1,
        px: 1.5,
        maxWidth: 800,
        ml: 0.025,
        border: '1px solid #e2e2e2',
        borderBottom: 'none',
        borderBottomRightRadius: '0px',
        borderBottomLeftRadius: '0px'
      }}
    >
      {iconsList.map((plugin) => (
        <Grid
          key={plugin.id}
          sx={{
            cursor: "pointer",
          }}
          item
        >
          {
            <plugin.Icon
              onClick={() => onClick(plugin.event)}
              color={isIconSelected(plugin) ? "primary" : undefined}
              sx={{ 
                ml: '-16px'
              }}
            />
          }
        </Grid>
      ))}
    </Grid>
  );
   
};