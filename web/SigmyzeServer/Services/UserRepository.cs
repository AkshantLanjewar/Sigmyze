using SigmyzeServer.Models.User;

public interface IUserRepository
{
    UserDTO GetUser(User user);
}

public class UserRepository : IUserRepository
{
    private readonly List<UserDTO> users = new List<UserDTO>();

    public UserRepository()
    {

    }

    public UserDTO GetUser(User user)
    {
        return users.Where(x => x.Id.ToLower() == user.Id.ToLower()
            && x.Password == user.Password).FirstOrDefault();
    }
}