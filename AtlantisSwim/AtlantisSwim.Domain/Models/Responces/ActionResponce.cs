namespace AtlantisSwim.Domain.Models.Responces
{
    public class ActionResponce
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public object? Data { get; set; }
    }
}
