using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.UserData;
using SigmyzeServer.Services;
using SigmyzeServer.Services.Auth;
using SigmyzeServer.Services.DatabaseServices;

namespace SigmyzeServer.Controllers.UserDataControllers;

public class DataControllerBase : ControllerBase
{
	private readonly ITokenDataService _tokenDataService;
	private readonly IDriveService _driveService;
	private readonly IUserAuth _userAuth;
	
	public DataControllerBase(ITokenDataService tokenDataService, IDriveService driveService, IUserAuth userAuth)
	{
		_tokenDataService = tokenDataService;
		_driveService = driveService;
		_userAuth = userAuth;
	}
	
	public async Task<IActionResult> SerializeJson(object data)
	{
		string content = await Task.Run(() => JsonConvert.SerializeObject((data)));
		return Content(
			content,
			"application/json"
		);
	}

	public async Task<User> GetUser()
	{
		string? accessToken = await HttpContext.GetTokenAsync("access_token");
		string lunarId = _tokenDataService.ExtractLunarID(accessToken!);
		User user = await _userAuth.GetAsync(lunarId);

		return user;
	}

	public async Task<Drive> GetDrive()
	{
		string? accessToken = await HttpContext.GetTokenAsync("access_token");
		string lunarId = _tokenDataService.ExtractLunarID(accessToken!);
		Drive drive = await _driveService.GetDrive(lunarId);

		return drive;
	}

	public async Task SaveDrive(Drive drive)
	{
		string? accessToken = await HttpContext.GetTokenAsync("access_token");
		string lunarId      = _tokenDataService.ExtractLunarID(accessToken!);

		await _driveService.SaveDrive(lunarId, drive);
	}

	public async Task SaveUser(User user)
	{
		string? accessToken = await HttpContext.GetTokenAsync("access_token");
		string lunarId      = _tokenDataService.ExtractLunarID(accessToken!);

		await _userAuth.UpdateAsync(lunarId, user);
	}
}