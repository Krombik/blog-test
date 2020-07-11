import { FC } from "react";
import SubscriptionsTwoToneIcon from "@material-ui/icons/SubscriptionsTwoTone";
import BannerButton from "../../components/common/BannerButton";
import { StyledSwitchableIcon } from "../../components/article/styled";
import { followUser } from "../../api/user";

type Props = {
  username: string;
  mutate: (...args: any) => any;
  token: string;
  follow: boolean;
};

const UserSubscribeButton: FC<Props> = ({
  username,
  token,
  mutate,
  follow,
}) => {
  let loading = false;
  const handleSubscribe = token
    ? async () => {
        if (!loading) {
          loading = true;
          const data = await followUser(!follow, username, token);
          if (data.profile) mutate(data, false);
        }
      }
    : null;
  return (
    <BannerButton
      tooltip={follow ? "Unsubscribe" : "Subscribe"}
      disabled={!token}
      onClick={handleSubscribe}
    >
      <StyledSwitchableIcon
        fontSize="inherit"
        color="inherit"
        active={follow}
        Icon={SubscriptionsTwoToneIcon}
      />
    </BannerButton>
  );
};

export default UserSubscribeButton;