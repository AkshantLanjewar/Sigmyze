using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Services;
using SigmyzeServer.Services.OrganizationServices;

namespace SigmyzeServer.Controllers;

[ApiController]
[Authorize]
[Route("/api/v{version:apiVersion}/code")]
[ApiVersion("2.0")]
public partial class CodeController : OrganizationControllerBase
{
    private readonly IQuantaRepository _quantaRepository;
    private readonly ICodeRepository _codeRepository;

    public CodeController(
        IOrganizationRepository organizationRepository,
        IQuantaRepository quantaRepository,
        ICodeRepository codeRepository
    ) : base(organizationRepository)
    {
        _quantaRepository = quantaRepository;
        _codeRepository = codeRepository;
    }    
}