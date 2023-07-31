using SigmyzeServer.Models.API;
using SigmyzeServer.Services.DatabaseServices;
using SigmyzeServer.Services.OrganizationServices;

namespace SigmyzeServer.Services.DatasetShared;

public partial class DatasetShared
{
    private readonly IQuantaDatasetService _quantaDatasetService;
    private readonly IQuantaIndicatorRepository _quantaIndicatorRepository;
    private readonly IQuantaRepository _quantaRepository;

    public DatasetShared(
        IQuantaDatasetService quantaDatasetService, 
        IQuantaIndicatorRepository quantaIndicatorRepository,
        IQuantaRepository quantaRepository
    )
    {
        _quantaDatasetService = quantaDatasetService;
        _quantaIndicatorRepository = quantaIndicatorRepository;
        _quantaRepository = quantaRepository;
    }

    protected APIStatusMsg ErrorMsg(string msg)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = true;
        status.MSG = msg;

        return status;
    }
}