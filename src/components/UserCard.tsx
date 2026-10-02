import { FaGithubAlt,FaUserMinus, FaUserPlus } from "react-icons/fa";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { checkIfFollowingGithubUser, followGithubUser, unfollowGithubUser } from "../api/github";

import type { GitHubUser } from "../types";

const UserCard = ({ user }: {user: GitHubUser}) => {
  /// Query to check if user is following
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ['follow-status', user.login],
    queryFn: () => checkIfFollowingGithubUser(user.login),
    enabled: !!user.login
  });

  const followMutation = useMutation({
    mutationFn: () => followGithubUser(user.login),
    onSuccess: () => {
      toast.success(`You are now following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowGithubUser(user.login),
    onSuccess: () => {
      toast.success(`You are no longer following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const handleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  }

  return (
    <>
      <div className='user-card'>
        <img className='avatar' src={user.avatar_url} alt={user.name} />
        <h2>{user.name || user.login}</h2>
        <p className='bio'>{user.bio}</p>

        <div className="user-card-buttons">
          <button
            disabled={followMutation.isPending || unfollowMutation.isPending}
            onClick={handleFollow}
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
          >
            {isFollowing ? (
              <>
                <FaUserMinus className="follow-icon" /> Following
            </>
            ) : (
              <>
               <FaUserPlus className="follow-icon" /> Follow User
              </>
            )}
          </button>
          <a className='profile-btn' href={user.html_url} target='_blank' rel='noopener noreferrer'><FaGithubAlt />View GitHub Profile</a>
        </div>
      </div>
    </>
  );
};

export default UserCard;
